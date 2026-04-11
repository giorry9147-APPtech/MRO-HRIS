'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuthGuard } from '@/lib/useAuthGuard';

interface Department {
  id: number;
  code: string;
  name: string;
  directorate_id: number;
  parent_department_id: number | null;
  status: string;
  sub_departments?: Department[];
}

interface StaffMember {
  employee_id: number;
  employee_number: string;
  name: string;
  position_id: number | null;
  position_title: string | null;
  employment_type: string;
  start_date: string | null;
}

interface StaffByDepartmentRow {
  department_id: number;
  department_name: string;
  directorate_id: number | null;
  directorate_name: string | null;
  headcount: number;
  employees: StaffMember[];
}

interface Directorate {
  id: number;
  code: string;
  name: string;
  description: string;
  status: string;
  departments?: Department[];
}

export default function OrganogramPage() {
  const { loading: authLoading, forbidden } = useAuthGuard('directorates.view');
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [staffByDepartment, setStaffByDepartment] = useState<Record<number, StaffByDepartmentRow>>({});
  const [expandedDepts, setExpandedDepts] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !forbidden) {
      void loadOrganogram();
    }
  }, [authLoading, forbidden]);

  const loadOrganogram = async () => {
    try {
      // Get all directorates
      const [dirsResp, deptsResp, staffingResp] = await Promise.all([
        apiFetch<{ data: Directorate[] }>('/directorates?per_page=200'),
        apiFetch<{ data: Department[] }>('/departments?per_page=500'),
        apiFetch<{ data: StaffByDepartmentRow[] }>('/reports/staff-by-department'),
      ]);
      
      // Build map of departments per directorate
      const dirMap: { [key: number]: Directorate } = {};
      dirsResp.data.forEach((dir: Directorate) => {
        dirMap[dir.id] = { ...dir, departments: [] };
      });
      
      deptsResp.data.forEach((dept: Department) => {
        if (dirMap[dept.directorate_id]) {
          if (!dirMap[dept.directorate_id].departments) {
            dirMap[dept.directorate_id].departments = [];
          }
          dirMap[dept.directorate_id].departments!.push(dept);
        }
      });

      const staffingMap: Record<number, StaffByDepartmentRow> = {};
      (staffingResp.data ?? []).forEach((row) => {
        staffingMap[row.department_id] = row;
      });
      
      setDirectorates(Object.values(dirMap).filter(d => d.departments && d.departments.length > 0));
      setStaffByDepartment(staffingMap);
    } catch (err) {
      console.error('Failed to load organogram:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (deptId: number) => {
    const newExpanded = new Set(expandedDepts);
    if (newExpanded.has(deptId)) {
      newExpanded.delete(deptId);
    } else {
      newExpanded.add(deptId);
    }
    setExpandedDepts(newExpanded);
  };

  const buildDeptTree = (depts: Department[]): Department[] => {
    const map: { [key: number]: Department } = {};
    const roots: Department[] = [];

    depts.forEach((dept) => {
      map[dept.id] = { ...dept, sub_departments: [] };
    });

    depts.forEach((dept) => {
      if (dept.parent_department_id) {
        const parent = map[dept.parent_department_id];
        if (parent) {
          parent.sub_departments?.push(map[dept.id]);
        }
      } else {
        roots.push(map[dept.id]);
      }
    });

    return roots;
  };

  const DepartmentNode = ({
    dept,
    level = 0,
  }: {
    dept: Department;
    level?: number;
  }) => {
    const isExpanded = expandedDepts.has(dept.id);
    const hasChildren = (dept.sub_departments?.length || 0) > 0;
    const staffing = staffByDepartment[dept.id];
    const hasEmployees = (staffing?.employees?.length ?? 0) > 0;
    const paddingLeft = level * 20;

    return (
      <div key={dept.id} className="border-l border-gray-300">
        <div
          style={{ paddingLeft: `${paddingLeft}px` }}
          className="py-2 px-3 hover:bg-blue-50 cursor-pointer flex items-center gap-2"
          onClick={() => hasChildren && toggleExpand(dept.id)}
        >
          {hasChildren ? (
            <span className="text-blue-600 font-bold w-5 text-center">
              {isExpanded ? '▼' : '▶'}
            </span>
          ) : (
            <span className="w-5" />
          )}
          <span className="text-sm">
            <span className="font-medium text-gray-800">{dept.name}</span>
            <span className="text-gray-500 ml-2 text-xs">({dept.code})</span>
            <span className="ml-2 text-xs text-emerald-700 font-medium">{staffing?.headcount ?? 0} medewerkers</span>
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {dept.sub_departments?.map((subDept) => (
              <DepartmentNode key={subDept.id} dept={subDept} level={level + 1} />
            ))}
          </div>
        )}

        {hasEmployees && isExpanded && (
          <div style={{ paddingLeft: `${paddingLeft + 24}px` }} className="pb-2">
            {staffing.employees.map((employee) => (
              <div key={employee.employee_id} className="text-xs text-gray-700 py-1">
                {employee.name} ({employee.employee_number}) - {employee.position_title ?? 'zonder functie'}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (authLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="flex items-center justify-center flex-1">
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="flex items-center justify-center flex-1">
          <p className="text-gray-600">Je hebt geen rechten om de organisatiestructuur te bekijken.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="flex items-center justify-center flex-1">
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 flex flex-col">
        <div className="overflow-auto flex-1 p-6">
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-1 text-gray-900">
                Organisatiestructuur Ministerie Regionale Ontwikkeling
              </h1>
              <p className="text-gray-600 mb-6">
                Volledige hiërarchie van directoraten, afdelingen en sub-afdelingen
              </p>

              <div className="space-y-6">
                {directorates.map((dir) => {
                  const treeDepts = buildDeptTree(dir.departments || []);
                  return (
                    <div
                      key={dir.id}
                      className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-3 h-3 rounded-full bg-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <h2 className="text-lg font-bold text-gray-900">
                            {dir.name}
                          </h2>
                          {dir.description && (
                            <p className="text-sm text-gray-600">
                              {dir.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Code: {dir.code}
                          </p>
                        </div>
                      </div>

                      <div className="ml-4 border-l-2 border-gray-300">
                        {treeDepts.map((dept) => (
                          <DepartmentNode key={dept.id} dept={dept} level={0} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

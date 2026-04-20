'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuthGuard } from '@/lib/useAuthGuard';
import ModuleFrame from '@/components/ui/ModuleFrame';

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

	async function loadOrganogram() {
		try {
			const [dirsResp, deptsResp, staffingResp] = await Promise.all([
				apiFetch<{ data: Directorate[] }>('/directorates?per_page=200'),
				apiFetch<{ data: Department[] }>('/departments?per_page=500'),
				apiFetch<{ data: StaffByDepartmentRow[] }>('/reports/staff-by-department'),
			]);

			const dirMap: Record<number, Directorate> = {};
			dirsResp.data.forEach((dir) => {
				dirMap[dir.id] = { ...dir, departments: [] };
			});

			deptsResp.data.forEach((dept) => {
				if (dirMap[dept.directorate_id]) {
					dirMap[dept.directorate_id].departments!.push(dept);
				}
			});

			const staffingMap: Record<number, StaffByDepartmentRow> = {};
			(staffingResp.data ?? []).forEach((row) => {
				staffingMap[row.department_id] = row;
			});

			setDirectorates(Object.values(dirMap).filter((d) => d.departments && d.departments.length > 0));
			setStaffByDepartment(staffingMap);
		} catch {
			// silently fail — page shows empty state
		} finally {
			setLoading(false);
		}
	}

	function toggleExpand(deptId: number) {
		setExpandedDepts((prev) => {
			const next = new Set(prev);
			if (next.has(deptId)) {
				next.delete(deptId);
			} else {
				next.add(deptId);
			}
			return next;
		});
	}

	function buildDeptTree(depts: Department[]): Department[] {
		const map: Record<number, Department> = {};
		const roots: Department[] = [];

		depts.forEach((dept) => {
			map[dept.id] = { ...dept, sub_departments: [] };
		});

		depts.forEach((dept) => {
			if (dept.parent_department_id) {
				const parent = map[dept.parent_department_id];
				if (parent) {
					parent.sub_departments!.push(map[dept.id]);
				}
			} else {
				roots.push(map[dept.id]);
			}
		});

		return roots;
	}

	function DepartmentNode({ dept, level = 0 }: { dept: Department; level?: number }) {
		const isExpanded = expandedDepts.has(dept.id);
		const hasChildren = (dept.sub_departments?.length ?? 0) > 0;
		const staffing = staffByDepartment[dept.id];
		const hasEmployees = (staffing?.employees?.length ?? 0) > 0;

		return (
			<div>
				<div
					className="dept-node-row"
					style={{ paddingLeft: `${level * 18 + 8}px` }}
					onClick={() => (hasChildren || hasEmployees) && toggleExpand(dept.id)}
				>
					<span className="dept-node-toggle">
						{(hasChildren || hasEmployees) ? (isExpanded ? '▼' : '▶') : ''}
					</span>
					<span className="dept-node-name">{dept.name}</span>
					<span className="dept-node-code">({dept.code})</span>
					<span className="dept-node-count">{staffing?.headcount ?? 0} mw.</span>
				</div>

				{isExpanded && hasChildren && (
					<div>
						{dept.sub_departments?.map((sub) => (
							<DepartmentNode key={sub.id} dept={sub} level={level + 1} />
						))}
					</div>
				)}

				{isExpanded && hasEmployees && !hasChildren && (
					<div className="dept-employees" style={{ paddingLeft: `${level * 18 + 32}px` }}>
						{staffing.employees.map((emp) => (
							<div key={emp.employee_id} className="dept-employee-row">
								{emp.name} ({emp.employee_number}) — {emp.position_title ?? 'zonder functie'}
							</div>
						))}
					</div>
				)}
			</div>
		);
	}

	if (authLoading || loading) {
		return (
			<ModuleFrame title="Organogram" icon="📊" kicker="Organisatiestructuur" subtitle="Volledige hiërarchie van de organisatie.">
				<p>Laden...</p>
			</ModuleFrame>
		);
	}

	if (forbidden) {
		return (
			<ModuleFrame title="Organogram" icon="📊" kicker="Organisatiestructuur" subtitle="">
				<p>Je hebt geen rechten om de organisatiestructuur te bekijken.</p>
			</ModuleFrame>
		);
	}

	return (
		<ModuleFrame
			title="Organogram"
			icon="📊"
			kicker="Organisatiestructuur"
			subtitle="Volledige hiërarchie van directoraten, afdelingen en medewerkers."
		>
			<div className="org-shell">
				{directorates.map((dir) => {
					const treeDepts = buildDeptTree(dir.departments ?? []);
					return (
						<div key={dir.id} className="card org-directorate">
							<div className="org-directorate-header">
								<div className="org-directorate-dot" />
								<div>
									<h2 style={{ margin: 0, fontSize: "1.08rem", fontWeight: 700, color: "#233241", fontFamily: "'Georgia', 'Iowan Old Style', serif" }}>
										{dir.name}
									</h2>
									{dir.description && (
										<p className="muted" style={{ margin: "0.2rem 0 0", fontSize: "0.88rem" }}>{dir.description}</p>
									)}
									<p className="muted" style={{ margin: "0.12rem 0 0", fontSize: "0.8rem" }}>Code: {dir.code}</p>
								</div>
							</div>
							<div className="org-dept-tree">
								{treeDepts.map((dept) => (
									<DepartmentNode key={dept.id} dept={dept} level={0} />
								))}
							</div>
						</div>
					);
				})}
				{directorates.length === 0 && (
					<p className="muted">Geen organisatiedata beschikbaar.</p>
				)}
			</div>
		</ModuleFrame>
	);
}

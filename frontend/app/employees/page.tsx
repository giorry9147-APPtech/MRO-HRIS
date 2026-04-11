"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasPermission } from "@/lib/auth";
import { ApiError, apiFetch } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuthGuard";
import ModuleFrame from "@/components/ui/ModuleFrame";

type Employee = {
	id: number;
	first_name: string;
	last_name: string;
	employee_number: string;
	status: string;
};

type EmployeeCollectionResponse = {
	data: Employee[];
};

export default function EmployeesPage() {
	const router = useRouter();
	const { user } = useAuthGuard();
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadEmployees() {
			try {
				const response = await apiFetch<EmployeeCollectionResponse>("/employees");
				setEmployees(response.data ?? []);
			} catch (err) {
				if (err instanceof ApiError && err.status === 401) {
					router.replace("/login");
					return;
				}

				if (err instanceof ApiError && err.status === 403) {
					setError("Je hebt geen rechten om medewerkers te bekijken.");
					return;
				}

				setError("Employees konden niet worden geladen.");
			} finally {
				setLoading(false);
			}
		}

		void loadEmployees();
	}, [router]);

	const filteredEmployees = employees.filter((employee) => {
		const keyword = query.trim().toLowerCase();
		if (!keyword) {
			return true;
		}

		return `${employee.employee_number} ${employee.first_name} ${employee.last_name} ${employee.status}`.toLowerCase().includes(keyword);
	});

	return (
		<ModuleFrame
			title="Employees"
			subtitle="Personeelsregister met snelle zoek- en navigatiefunctie."
			actions={hasPermission(user, "employees.create") ? <Link className="btn link" href="/employees/new">New employee</Link> : undefined}
			filters={
				<div className="filter-row">
					<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Zoek op naam, nummer of status" />
				</div>
			}
		>
			{loading && <p>Laden...</p>}
			{error && <p className="error">{error}</p>}

			{!loading && !error && (
				<div className="list-grid">
					{filteredEmployees.map((employee) => (
						<div key={employee.id} className="list-row">
							<div>
								<strong>{employee.employee_number}</strong> - {employee.first_name} {employee.last_name}
								<div className="muted">Status: {employee.status}</div>
							</div>
							<div className="list-row-actions">
								<Link className="btn secondary link" href={`/employees/${employee.id}`}>Open</Link>
							</div>
						</div>
					))}
				</div>
			)}
		</ModuleFrame>
	);
}

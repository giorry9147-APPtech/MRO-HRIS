"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuthGuard";
import ModuleFrame from "@/components/ui/ModuleFrame";

export default function ReportsPage() {
	const { loading, forbidden } = useAuthGuard("reports.view");
	const [summary, setSummary] = useState<null | {
		employees: number;
		directorates: number;
		departments: number;
		positions: number;
		documents: number;
		assets: number;
	}>(null);
	const [headcount, setHeadcount] = useState<null | {
		total: number;
		active: number;
		inactive: number;
		on_leave: number;
		suspended: number;
		exited: number;
	}>(null);
	const [departmentRows, setDepartmentRows] = useState<Array<{
		department_id: number;
		department_name: string;
		headcount: number;
	}>>([]);
	const [payScaleReport, setPayScaleReport] = useState<{
		groups: Array<{
			pay_scale_id: number;
			scale_code: string;
			step_number: number;
			employees: number;
		}>;
		unassigned_active_employees: number;
	} | null>(null);
	const [assetReport, setAssetReport] = useState<null | {
		total_assets: number;
		assigned_now: number;
		available: number;
		assigned: number;
		under_maintenance: number;
		retired: number;
		lost: number;
	}>(null);
	const [incompleteReport, setIncompleteReport] = useState<{
		total_incomplete: number;
		employees: Array<{
			id: number;
			employee_number: string;
			name: string;
			status: string;
			missing_documents: boolean;
			missing_active_employment: boolean;
			missing_active_salary: boolean;
		}>;
	} | null>(null);
	const [staffingRows, setStaffingRows] = useState<Array<{
		department_id: number;
		department_name: string;
		directorate_id: number | null;
		directorate_name: string | null;
		headcount: number;
		employees: Array<{
			employee_id: number;
			employee_number: string;
			name: string;
			position_id: number | null;
			position_title: string | null;
			employment_type: string;
			start_date: string | null;
		}>;
	}>>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (loading || forbidden) {
			return;
		}

		async function loadReports() {
			try {
				const [summaryResponse, headcountResponse, departmentsResponse, payScaleResponse, assetsResponse, incompleteResponse, staffingResponse] = await Promise.all([
					apiFetch<{
						data: {
							employees: number;
							directorates: number;
							departments: number;
							positions: number;
							documents: number;
							assets: number;
						};
					}>("/reports/summary"),
					apiFetch<{
						data: {
							total: number;
							active: number;
							inactive: number;
							on_leave: number;
							suspended: number;
							exited: number;
						};
					}>("/reports/headcount"),
					apiFetch<{
						data: Array<{
							department_id: number;
							department_name: string;
							headcount: number;
						}>;
					}>("/reports/by-department"),
					apiFetch<{
						data: {
							groups: Array<{
								pay_scale_id: number;
								scale_code: string;
								step_number: number;
								employees: number;
							}>;
							unassigned_active_employees: number;
						};
					}>("/reports/by-pay-scale"),
					apiFetch<{
						data: {
							total_assets: number;
							assigned_now: number;
							available: number;
							assigned: number;
							under_maintenance: number;
							retired: number;
							lost: number;
						};
					}>("/reports/assets"),
					apiFetch<{
						data: {
							total_incomplete: number;
							employees: Array<{
								id: number;
								employee_number: string;
								name: string;
								status: string;
								missing_documents: boolean;
								missing_active_employment: boolean;
								missing_active_salary: boolean;
							}>;
						};
					}>("/reports/incomplete-dossiers"),
					apiFetch<{
						data: Array<{
							department_id: number;
							department_name: string;
							directorate_id: number | null;
							directorate_name: string | null;
							headcount: number;
							employees: Array<{
								employee_id: number;
								employee_number: string;
								name: string;
								position_id: number | null;
								position_title: string | null;
								employment_type: string;
								start_date: string | null;
							}>;
						}>;
					}>("/reports/staff-by-department"),
				]);

				setSummary(summaryResponse.data);
				setHeadcount(headcountResponse.data);
				setDepartmentRows(departmentsResponse.data);
				setPayScaleReport(payScaleResponse.data);
				setAssetReport(assetsResponse.data);
				setIncompleteReport(incompleteResponse.data);
				setStaffingRows(staffingResponse.data ?? []);
			} catch {
				setError("Rapportgegevens konden niet worden geladen.");
			}
		}

		void loadReports();
	}, [loading, forbidden]);

	if (loading) {
		return <main style={{ padding: "1.5rem" }}><p>Laden...</p></main>;
	}

	if (forbidden) {
		return <main style={{ padding: "1.5rem" }}><p>Je hebt geen rechten om rapporten te bekijken.</p></main>;
	}

	return (
		<ModuleFrame title="Reports" subtitle="Kernrapportages en managementoverzicht.">
			{error && <p className="error">{error}</p>}
			{headcount && (
				<>
					<h3 style={{ marginTop: 0 }}>Headcount</h3>
					<div className="stat-grid">
						<div className="stat"><div className="muted">Total</div><div>{headcount.total}</div></div>
						<div className="stat"><div className="muted">Active</div><div>{headcount.active}</div></div>
						<div className="stat"><div className="muted">Inactive</div><div>{headcount.inactive}</div></div>
						<div className="stat"><div className="muted">On Leave</div><div>{headcount.on_leave}</div></div>
						<div className="stat"><div className="muted">Suspended</div><div>{headcount.suspended}</div></div>
						<div className="stat"><div className="muted">Exited</div><div>{headcount.exited}</div></div>
					</div>
				</>
			)}
			{summary && (
				<>
					<h3>Summary</h3>
					<div className="stat-grid">
						<div className="stat"><div className="muted">Employees</div><div>{summary.employees}</div></div>
						<div className="stat"><div className="muted">Directorates</div><div>{summary.directorates}</div></div>
						<div className="stat"><div className="muted">Departments</div><div>{summary.departments}</div></div>
						<div className="stat"><div className="muted">Positions</div><div>{summary.positions}</div></div>
						<div className="stat"><div className="muted">Documents</div><div>{summary.documents}</div></div>
						<div className="stat"><div className="muted">Assets</div><div>{summary.assets}</div></div>
					</div>
				</>
			)}
			<h3 style={{ marginTop: "1.5rem" }}>Headcount By Department</h3>
			<div className="table-wrapper">
				<table className="table">
					<thead>
						<tr>
							<th>Department</th>
							<th>Headcount</th>
						</tr>
					</thead>
					<tbody>
						{departmentRows.map((row) => (
							<tr key={row.department_id}>
								<td>{row.department_name}</td>
								<td>{row.headcount}</td>
							</tr>
						))}
						{departmentRows.length === 0 && (
							<tr>
								<td colSpan={2} className="muted">Geen afdelingsdata beschikbaar.</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<h3 style={{ marginTop: "1.5rem" }}>Employees By Pay Scale</h3>
			<div className="table-wrapper">
				<table className="table">
					<thead>
						<tr>
							<th>Scale</th>
							<th>Step</th>
							<th>Employees</th>
						</tr>
					</thead>
					<tbody>
						{payScaleReport?.groups.map((row) => (
							<tr key={row.pay_scale_id}>
								<td>{row.scale_code}</td>
								<td>{row.step_number}</td>
								<td>{row.employees}</td>
							</tr>
						))}
						{(!payScaleReport || payScaleReport.groups.length === 0) && (
							<tr>
								<td colSpan={3} className="muted">Geen pay scale data beschikbaar.</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			{payScaleReport && (
				<p className="muted">Active employees without pay scale: {payScaleReport.unassigned_active_employees}</p>
			)}

			{assetReport && (
				<>
					<h3 style={{ marginTop: "1.5rem" }}>Asset Status</h3>
					<div className="stat-grid">
						<div className="stat"><div className="muted">Total Assets</div><div>{assetReport.total_assets}</div></div>
						<div className="stat"><div className="muted">Assigned Now</div><div>{assetReport.assigned_now}</div></div>
						<div className="stat"><div className="muted">Available</div><div>{assetReport.available}</div></div>
						<div className="stat"><div className="muted">Assigned</div><div>{assetReport.assigned}</div></div>
						<div className="stat"><div className="muted">Maintenance</div><div>{assetReport.under_maintenance}</div></div>
						<div className="stat"><div className="muted">Retired</div><div>{assetReport.retired}</div></div>
						<div className="stat"><div className="muted">Lost</div><div>{assetReport.lost}</div></div>
					</div>
				</>
			)}

			<h3 style={{ marginTop: "1.5rem" }}>Incomplete Dossiers</h3>
			<p className="muted">Total incomplete: {incompleteReport?.total_incomplete ?? 0}</p>
			<div className="table-wrapper">
				<table className="table">
					<thead>
						<tr>
							<th>Employee #</th>
							<th>Name</th>
							<th>Status</th>
							<th>Missing</th>
						</tr>
					</thead>
					<tbody>
						{incompleteReport?.employees.map((row) => {
							const missing = [
								row.missing_documents ? "documents" : null,
								row.missing_active_employment ? "active employment" : null,
								row.missing_active_salary ? "active salary" : null,
							].filter(Boolean).join(", ");

							return (
								<tr key={row.id}>
									<td>{row.employee_number}</td>
									<td>{row.name}</td>
									<td>{row.status}</td>
									<td>{missing || "-"}</td>
								</tr>
							);
						})}
						{(!incompleteReport || incompleteReport.employees.length === 0) && (
							<tr>
								<td colSpan={4} className="muted">Geen incomplete dossiers gevonden.</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<h3 style={{ marginTop: "1.5rem" }}>Wie Werkt Waar</h3>
			<div className="table-wrapper">
				<table className="table">
					<thead>
						<tr>
							<th>Directoraat</th>
							<th>Afdeling</th>
							<th>Headcount</th>
							<th>Medewerkers</th>
						</tr>
					</thead>
					<tbody>
						{staffingRows.map((row) => (
							<tr key={row.department_id}>
								<td>{row.directorate_name ?? "-"}</td>
								<td>{row.department_name}</td>
								<td>{row.headcount}</td>
								<td>
									{row.employees.length === 0
										? "-"
										: row.employees
											.map((employee) => `${employee.name} (${employee.position_title ?? "zonder functie"})`)
											.join(", ")}
								</td>
							</tr>
						))}
						{staffingRows.length === 0 && (
							<tr>
								<td colSpan={4} className="muted">Geen staffingdata beschikbaar.</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</ModuleFrame>
	);
}

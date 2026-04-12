"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuthGuard";
import ModuleFrame from "@/components/ui/ModuleFrame";

type ReportSection = "overview" | "department" | "payScale" | "assets" | "incomplete" | "staffing";

export default function ReportsPage() {
	const { loading, forbidden } = useAuthGuard("reports.view");
	const [activeSection, setActiveSection] = useState<ReportSection>("overview");
	const [loadedSections, setLoadedSections] = useState<Record<ReportSection, boolean>>({
		overview: false,
		department: false,
		payScale: false,
		assets: false,
		incomplete: false,
		staffing: false,
	});
	const loadingSectionsRef = useRef<Set<ReportSection>>(new Set());
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

	const loadOverview = useCallback(async () => {
		if (loadedSections.overview || loadingSectionsRef.current.has("overview")) {
			return;
		}

		loadingSectionsRef.current.add("overview");
		try {
			const [summaryResponse, headcountResponse] = await Promise.all([
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
			]);

			setSummary(summaryResponse.data);
			setHeadcount(headcountResponse.data);
			setLoadedSections((current) => ({ ...current, overview: true }));
		} catch {
			setError("Overzichtsrapport kon niet worden geladen.");
		} finally {
			loadingSectionsRef.current.delete("overview");
		}
	}, [loadedSections.overview]);

	const loadDepartmentReport = useCallback(async () => {
		if (loadedSections.department || loadingSectionsRef.current.has("department")) {
			return;
		}

		loadingSectionsRef.current.add("department");
		try {
			const departmentsResponse = await apiFetch<{
				data: Array<{
					department_id: number;
					department_name: string;
					headcount: number;
				}>;
			}>("/reports/by-department");

			setDepartmentRows(departmentsResponse.data);
			setLoadedSections((current) => ({ ...current, department: true }));
		} catch {
			setError("Afdelingsrapport kon niet worden geladen.");
		} finally {
			loadingSectionsRef.current.delete("department");
		}
	}, [loadedSections.department]);

	const loadPayScaleReport = useCallback(async () => {
		if (loadedSections.payScale || loadingSectionsRef.current.has("payScale")) {
			return;
		}

		loadingSectionsRef.current.add("payScale");
		try {
			const payScaleResponse = await apiFetch<{
				data: {
					groups: Array<{
						pay_scale_id: number;
						scale_code: string;
						step_number: number;
						employees: number;
					}>;
					unassigned_active_employees: number;
				};
			}>("/reports/by-pay-scale");

			setPayScaleReport(payScaleResponse.data);
			setLoadedSections((current) => ({ ...current, payScale: true }));
		} catch {
			setError("Schaalrapport kon niet worden geladen.");
		} finally {
			loadingSectionsRef.current.delete("payScale");
		}
	}, [loadedSections.payScale]);

	const loadAssetReport = useCallback(async () => {
		if (loadedSections.assets || loadingSectionsRef.current.has("assets")) {
			return;
		}

		loadingSectionsRef.current.add("assets");
		try {
			const assetsResponse = await apiFetch<{
				data: {
					total_assets: number;
					assigned_now: number;
					available: number;
					assigned: number;
					under_maintenance: number;
					retired: number;
					lost: number;
				};
			}>("/reports/assets");

			setAssetReport(assetsResponse.data);
			setLoadedSections((current) => ({ ...current, assets: true }));
		} catch {
			setError("Assetrapport kon niet worden geladen.");
		} finally {
			loadingSectionsRef.current.delete("assets");
		}
	}, [loadedSections.assets]);

	const loadIncompleteReport = useCallback(async () => {
		if (loadedSections.incomplete || loadingSectionsRef.current.has("incomplete")) {
			return;
		}

		loadingSectionsRef.current.add("incomplete");
		try {
			const incompleteResponse = await apiFetch<{
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
			}>("/reports/incomplete-dossiers");

			setIncompleteReport(incompleteResponse.data);
			setLoadedSections((current) => ({ ...current, incomplete: true }));
		} catch {
			setError("Incomplete dossiers rapport kon niet worden geladen.");
		} finally {
			loadingSectionsRef.current.delete("incomplete");
		}
	}, [loadedSections.incomplete]);

	const loadStaffingReport = useCallback(async () => {
		if (loadedSections.staffing || loadingSectionsRef.current.has("staffing")) {
			return;
		}

		loadingSectionsRef.current.add("staffing");
		try {
			const staffingResponse = await apiFetch<{
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
			}>("/reports/staff-by-department");

			setStaffingRows(staffingResponse.data ?? []);
			setLoadedSections((current) => ({ ...current, staffing: true }));
		} catch {
			setError("Staffingrapport kon niet worden geladen.");
		} finally {
			loadingSectionsRef.current.delete("staffing");
		}
	}, [loadedSections.staffing]);

	useEffect(() => {
		if (loading || forbidden) {
			return;
		}

		void loadOverview();
	}, [forbidden, loading, loadOverview]);

	useEffect(() => {
		if (loading || forbidden) {
			return;
		}

		if (activeSection === "department") {
			void loadDepartmentReport();
			return;
		}

		if (activeSection === "payScale") {
			void loadPayScaleReport();
			return;
		}

		if (activeSection === "assets") {
			void loadAssetReport();
			return;
		}

		if (activeSection === "incomplete") {
			void loadIncompleteReport();
			return;
		}

		if (activeSection === "staffing") {
			void loadStaffingReport();
		}
	}, [
		activeSection,
		forbidden,
		loadAssetReport,
		loadDepartmentReport,
		loadIncompleteReport,
		loadPayScaleReport,
		loadStaffingReport,
		loading,
	]);

	if (loading) {
		return <main style={{ padding: "1.5rem" }}><p>Laden...</p></main>;
	}

	if (forbidden) {
		return <main style={{ padding: "1.5rem" }}><p>Je hebt geen rechten om rapporten te bekijken.</p></main>;
	}

	return (
		<ModuleFrame title="Rapporten" subtitle="Kernrapportages en managementoverzicht.">
			{error && <p className="error">{error}</p>}
			<div className="tabs">
				<button type="button" className={`tab-btn${activeSection === "overview" ? " active" : ""}`} onClick={() => setActiveSection("overview")}>Overzicht</button>
				<button type="button" className={`tab-btn${activeSection === "department" ? " active" : ""}`} onClick={() => setActiveSection("department")}>Per afdeling</button>
				<button type="button" className={`tab-btn${activeSection === "payScale" ? " active" : ""}`} onClick={() => setActiveSection("payScale")}>Per salarisschaal</button>
				<button type="button" className={`tab-btn${activeSection === "assets" ? " active" : ""}`} onClick={() => setActiveSection("assets")}>Bedrijfsmiddelen</button>
				<button type="button" className={`tab-btn${activeSection === "incomplete" ? " active" : ""}`} onClick={() => setActiveSection("incomplete")}>Onvolledig</button>
				<button type="button" className={`tab-btn${activeSection === "staffing" ? " active" : ""}`} onClick={() => setActiveSection("staffing")}>Bezetting</button>
			</div>

			{activeSection === "overview" && headcount && (
				<>
					<h3 style={{ marginTop: 0 }}>Personeelsbezetting</h3>
					<div className="stat-grid">
						<div className="stat"><div className="muted">Totaal</div><div>{headcount.total}</div></div>
						<div className="stat"><div className="muted">Actief</div><div>{headcount.active}</div></div>
						<div className="stat"><div className="muted">Inactief</div><div>{headcount.inactive}</div></div>
						<div className="stat"><div className="muted">Met verlof</div><div>{headcount.on_leave}</div></div>
						<div className="stat"><div className="muted">Geschorst</div><div>{headcount.suspended}</div></div>
						<div className="stat"><div className="muted">Uit dienst</div><div>{headcount.exited}</div></div>
					</div>
				</>
			)}
			{activeSection === "overview" && summary && (
				<>
					<h3>Samenvatting</h3>
					<div className="stat-grid">
						<div className="stat"><div className="muted">Medewerkers</div><div>{summary.employees}</div></div>
						<div className="stat"><div className="muted">Directoraten</div><div>{summary.directorates}</div></div>
						<div className="stat"><div className="muted">Afdelingen</div><div>{summary.departments}</div></div>
						<div className="stat"><div className="muted">Werkposities</div><div>{summary.positions}</div></div>
						<div className="stat"><div className="muted">Documenten</div><div>{summary.documents}</div></div>
						<div className="stat"><div className="muted">Bedrijfsmiddelen</div><div>{summary.assets}</div></div>
					</div>
				</>
			)}
			{activeSection === "department" && (
				<>
					<h3 style={{ marginTop: "1.5rem" }}>Personeelsbezetting per afdeling</h3>
					<div className="table-wrapper">
						<table className="table">
							<thead>
								<tr>
									<th>Afdeling</th>
									<th>Bezetting</th>
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
				</>
			)}

			{activeSection === "payScale" && (
				<>
					<h3 style={{ marginTop: "1.5rem" }}>Medewerkers per salarisschaal</h3>
					<div className="table-wrapper">
						<table className="table">
							<thead>
								<tr>
									<th>Schaal</th>
									<th>Step</th>
									<th>Medewerkers</th>
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
										<td colSpan={3} className="muted">Geen schaaldata beschikbaar.</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
					{payScaleReport && (
						<p className="muted">Actieve medewerkers zonder schaal: {payScaleReport.unassigned_active_employees}</p>
					)}
				</>
			)}

			{activeSection === "assets" && assetReport && (
				<>
					<h3 style={{ marginTop: "1.5rem" }}>Status bedrijfsmiddelen</h3>
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

			{activeSection === "incomplete" && (
				<>
					<h3 style={{ marginTop: "1.5rem" }}>Onvolledige dossiers</h3>
					<p className="muted">Totaal onvolledig: {incompleteReport?.total_incomplete ?? 0}</p>
					<div className="table-wrapper">
						<table className="table">
							<thead>
								<tr>
									<th>Personeelsnr.</th>
									<th>Naam</th>
									<th>Status</th>
									<th>Ontbreekt</th>
								</tr>
							</thead>
							<tbody>
								{incompleteReport?.employees.map((row) => {
									const missing = [
										row.missing_documents ? "documenten" : null,
										row.missing_active_employment ? "actief dienstverband" : null,
										row.missing_active_salary ? "actief salaris" : null,
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
				</>
			)}

			{activeSection === "staffing" && (
				<>
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
				</>
			)}
		</ModuleFrame>
	);
}

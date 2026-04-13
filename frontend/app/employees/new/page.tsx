"use client";

import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuthGuard";
import EmployeeForm, { EmployeeFormValues } from "@/components/employee/EmployeeForm";
import { useEffect, useMemo, useState } from "react";

type Directorate = { id: number; name: string };
type Department = { id: number; name: string; directorate_id: number | null };
type JobFunction = { id: number; title: string };
type Position = {
	id: number;
	title: string;
	department_id: number | null;
	directorate_id: number | null;
	job_function_id: number | null;
};

export default function NewEmployeePage() {
	const router = useRouter();
	const { loading, forbidden } = useAuthGuard("employees.create");
	const [directorates, setDirectorates] = useState<Directorate[]>([]);
	const [departments, setDepartments] = useState<Department[]>([]);
	const [jobFunctions, setJobFunctions] = useState<JobFunction[]>([]);
	const [positions, setPositions] = useState<Position[]>([]);
	const [selectedDirectorateId, setSelectedDirectorateId] = useState("");
	const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
	const [selectedJobFunctionId, setSelectedJobFunctionId] = useState("");
	const [selectedPositionId, setSelectedPositionId] = useState("");
	const [employmentStartDate, setEmploymentStartDate] = useState("");
	const [employmentType, setEmploymentType] = useState("permanent");
	const [salaryAmount, setSalaryAmount] = useState("");
	const [salaryCurrency, setSalaryCurrency] = useState("SRD");
	const [salaryStartDate, setSalaryStartDate] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [refreshOptionsKey, setRefreshOptionsKey] = useState(0);

	useEffect(() => {
		if (loading || forbidden) {
			return;
		}

		async function loadFormOptions() {
			try {
				setError(null);
				const [directorateResponse, departmentResponse, jobFunctionResponse, positionResponse] = await Promise.all([
					apiFetch<{ data: Directorate[] }>("/directorates?per_page=2000"),
					apiFetch<{ data: Department[] }>("/departments?per_page=2000"),
					apiFetch<{ data: JobFunction[] }>("/job-functions?per_page=2000"),
					apiFetch<{ data: Position[] }>("/positions?per_page=2000"),
				]);

				setDirectorates(directorateResponse.data ?? []);
				setDepartments(departmentResponse.data ?? []);
				setJobFunctions(jobFunctionResponse.data ?? []);
				setPositions(positionResponse.data ?? []);
			} catch {
				setError("Keuzelijsten konden niet worden geladen. Controleer API-rechten en configuratie.");
			}
		}

		void loadFormOptions();
	}, [forbidden, loading, refreshOptionsKey]);

	const filteredDepartments = useMemo(() => {
		if (!selectedDirectorateId) {
			return departments;
		}

		return departments.filter((department) => String(department.directorate_id ?? "") === selectedDirectorateId);
	}, [departments, selectedDirectorateId]);

	const filteredPositions = useMemo(() => {
		return positions.filter((position) => {
			if (selectedDirectorateId && String(position.directorate_id ?? "") !== selectedDirectorateId) {
				return false;
			}

			if (selectedDepartmentId && String(position.department_id ?? "") !== selectedDepartmentId) {
				return false;
			}

			if (selectedJobFunctionId && String(position.job_function_id ?? "") !== selectedJobFunctionId) {
				return false;
			}

			return true;
		});
	}, [positions, selectedDepartmentId, selectedDirectorateId, selectedJobFunctionId]);

	async function handleCreate(values: EmployeeFormValues) {
		setError(null);

		const formData = new FormData();
		formData.append("employee_number", values.employee_number);
		formData.append("first_name", values.first_name);
		formData.append("last_name", values.last_name);
		if (values.email) formData.append("email", values.email);
		if (values.phone) formData.append("phone", values.phone);
		if (values.address) formData.append("address", values.address);
		if (values.date_joined) formData.append("date_joined", values.date_joined);
		formData.append("status", values.status);
		if (values.profile_photo) {
			formData.append("profile_photo", values.profile_photo);
		}

		const response = await apiFetch<{ data: { id: number } }>("/employees", {
			method: "POST",
			body: formData,
		});

		const employeeId = response.data.id;

		if (employmentStartDate) {
			await apiFetch("/employment-records", {
				method: "POST",
				body: JSON.stringify({
					employee_id: employeeId,
					position_id: selectedPositionId ? Number(selectedPositionId) : null,
					job_function_id: selectedJobFunctionId ? Number(selectedJobFunctionId) : null,
					start_date: employmentStartDate,
					employment_type: employmentType,
					status: "active",
				}),
			});
		}

		if (salaryAmount && salaryStartDate) {
			await apiFetch("/salary-assignments", {
				method: "POST",
				body: JSON.stringify({
					employee_id: employeeId,
					amount: Number(salaryAmount),
					currency: salaryCurrency,
					start_date: salaryStartDate,
					status: "active",
				}),
			});
		}

		router.push(`/employees/${employeeId}`);
	}

	if (loading) {
		return <main style={{ padding: "1.5rem" }}><p>Laden...</p></main>;
	}

	if (forbidden) {
		return <main style={{ padding: "1.5rem" }}><p>Je hebt geen rechten om medewerkers aan te maken.</p></main>;
	}

	return (
		<main style={{ padding: "1.5rem" }}>
			<h1>Nieuwe medewerker</h1>
			{error && <p className="error">{error}</p>}
			<EmployeeForm
				initialValues={{
					employee_number: "",
					first_name: "",
					last_name: "",
					email: "",
					phone: "",
					address: "",
					profile_photo: null,
					date_joined: "",
					status: "active",
				}}
				onSubmit={handleCreate}
				submitLabel="Medewerker aanmaken"
			/>

			<section className="card" style={{ marginTop: "1rem", maxWidth: "700px" }}>
				<h2 style={{ marginTop: 0 }}>Werkgegevens koppelen</h2>
				<p style={{ marginTop: 0 }}>
					<button className="btn secondary" type="button" onClick={() => setRefreshOptionsKey((current) => current + 1)}>Lijsten verversen</button>
				</p>
				<p className="muted" style={{ marginTop: 0 }}>Deze velden worden direct na het aanmaken gekoppeld als huidige werkgegevens.</p>
				<div className="grid" style={{ gap: "0.75rem" }}>
					<label htmlFor="directorate-select">Directoraat</label>
					<select
						id="directorate-select"
						value={selectedDirectorateId}
						onChange={(event) => {
							setSelectedDirectorateId(event.target.value);
							setSelectedDepartmentId("");
							setSelectedPositionId("");
						}}
					>
						<option value="">Selecteer directoraat</option>
						{directorates.map((directorate) => <option key={directorate.id} value={directorate.id}>{directorate.name}</option>)}
					</select>

					<label htmlFor="department-select">Afdeling</label>
					<select
						id="department-select"
						value={selectedDepartmentId}
						onChange={(event) => {
							setSelectedDepartmentId(event.target.value);
							setSelectedPositionId("");
						}}
					>
						<option value="">Selecteer afdeling</option>
						{filteredDepartments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
					</select>

					<label htmlFor="job-function-select">Functie</label>
					<select
						id="job-function-select"
						value={selectedJobFunctionId}
						onChange={(event) => {
							setSelectedJobFunctionId(event.target.value);
							setSelectedPositionId("");
						}}
					>
						<option value="">Selecteer functie</option>
						{jobFunctions.map((jobFunction) => <option key={jobFunction.id} value={jobFunction.id}>{jobFunction.title}</option>)}
					</select>

					<label htmlFor="position-select">Werkpositie</label>
					<select id="position-select" value={selectedPositionId} onChange={(event) => setSelectedPositionId(event.target.value)}>
						<option value="">Selecteer werkpositie</option>
						{filteredPositions.map((position) => <option key={position.id} value={position.id}>{position.title}</option>)}
					</select>

					<label htmlFor="employment-start-date">Startdatum dienstverband</label>
					<input id="employment-start-date" type="date" value={employmentStartDate} onChange={(event) => setEmploymentStartDate(event.target.value)} />

					<label htmlFor="employment-type">Dienstverband</label>
					<select id="employment-type" value={employmentType} onChange={(event) => setEmploymentType(event.target.value)}>
						<option value="permanent">Vaste dienst</option>
						<option value="contract">Overeenkomst</option>
						<option value="temporary">Tijdelijke dienst</option>
					</select>
				</div>
			</section>

			<section className="card" style={{ marginTop: "1rem", maxWidth: "700px" }}>
				<h2 style={{ marginTop: 0 }}>Salaris koppelen (optioneel)</h2>
				<div className="filter-row">
					<input type="number" min="0" step="0.01" value={salaryAmount} onChange={(event) => setSalaryAmount(event.target.value)} placeholder="Salarisbedrag" />
					<select value={salaryCurrency} onChange={(event) => setSalaryCurrency(event.target.value)}>
						<option value="SRD">SRD</option>
						<option value="USD">USD</option>
						<option value="EUR">EUR</option>
					</select>
					<input type="date" value={salaryStartDate} onChange={(event) => setSalaryStartDate(event.target.value)} />
				</div>
			</section>
		</main>
	);
}

"use client";

import { FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hasPermission } from "@/lib/auth";
import { ApiError, apiFetch } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuthGuard";
import EmployeeForm, { EmployeeFormValues } from "@/components/employee/EmployeeForm";
import ModuleFrame from "@/components/ui/ModuleFrame";

type Employee = {
	id: number;
	employee_number: string;
	first_name: string;
	last_name: string;
	email: string | null;
	phone: string | null;
	address: string | null;
	profile_photo_url: string | null;
	date_joined: string | null;
	status: string;
	current_employment: {
		id: number;
		position_id: number | null;
		position_title: string | null;
		job_function_id: number | null;
		job_function_title: string | null;
		department_id: number | null;
		department_name: string | null;
		directorate_id: number | null;
		directorate_name: string | null;
		start_date: string | null;
		end_date: string | null;
		employment_type: string;
		status: string;
	} | null;
};

type Directorate = { id: number; name: string };
type Department = { id: number; name: string; directorate_id: number | null };
type JobFunction = { id: number; title: string };
type EmploymentRecord = {
	id: number;
	position_title: string | null;
	job_function_id: number | null;
	job_function_title: string | null;
	department_name: string | null;
	directorate_name: string | null;
	start_date: string;
	end_date: string | null;
	employment_type: string;
	status: string;
};
type Asset = { id: number; asset_tag: string; name: string };
type Qualification = {
	id: number;
	name: string;
	institution: string | null;
	obtained_date: string | null;
	expiry_date: string | null;
	credential_id: string | null;
	status: string;
	notes: string | null;
};
type WorkExperience = {
	id: number;
	company_name: string;
	job_title: string;
	start_date: string;
	end_date: string | null;
	description: string | null;
};
type Assignment = { id: number; asset_name: string | null; asset_tag: string | null; status: string; assigned_at: string; returned_at: string | null };
type SalaryAssignment = { id: number; amount: string; currency: string; start_date: string; end_date: string | null; status: string };

type EmployeeTab = "profile" | "employment" | "documents" | "qualifications" | "work" | "salary" | "assets" | "history";

function getErrorMessage(err: unknown, fallback: string): string {
	if (err instanceof ApiError && err.message) return err.message;
	if (err instanceof Error && err.message) return err.message;
	return fallback;
}

function getEmploymentTypeLabel(type: string) {
	switch (type) {
		case "permanent": return "Vaste dienst";
		case "contract": return "Overeenkomst";
		case "temporary": return "Tijdelijke dienst";
		default: return type;
	}
}

function getEmployeeStatusLabel(status: string) {
	switch (status) {
		case "active": return "Actief";
		case "inactive": return "Inactief";
		case "on_leave": return "Met verlof";
		case "suspended": return "Geschorst";
		case "exited": return "Uit dienst";
		default: return status;
	}
}

export default function EmployeeDetailPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const employeeId = params.id;
	const { user, loading, forbidden } = useAuthGuard("employees.view");
	const queryClient = useQueryClient();

	const [activeTab, setActiveTab] = useState<EmployeeTab>("profile");
	const [error, setError] = useState<string | null>(null);

	// Employment form state
	const [directorateId, setDirectorateId] = useState("");
	const [departmentId, setDepartmentId] = useState("");
	const [jobFunctionId, setJobFunctionId] = useState("");
	const [employmentType, setEmploymentType] = useState("permanent");
	const [startDate, setStartDate] = useState("");

	// Document form state
	const [documentTitle, setDocumentTitle] = useState("");
	const [documentType, setDocumentType] = useState("");
	const [documentFile, setDocumentFile] = useState<File | null>(null);

	// Asset form state
	const [assetId, setAssetId] = useState("");

	// Salary form state
	const [salaryAmount, setSalaryAmount] = useState("");
	const [salaryCurrency, setSalaryCurrency] = useState("SRD");
	const [salaryStartDate, setSalaryStartDate] = useState("");

	// Qualification form state
	const [qualificationName, setQualificationName] = useState("");
	const [qualificationInstitution, setQualificationInstitution] = useState("");
	const [qualificationObtainedDate, setQualificationObtainedDate] = useState("");
	const [qualificationStatus, setQualificationStatus] = useState("valid");
	const [qualificationError, setQualificationError] = useState<string | null>(null);
	const [editingQualificationId, setEditingQualificationId] = useState<number | null>(null);

	// Work experience form state
	const [experienceCompanyName, setExperienceCompanyName] = useState("");
	const [experienceJobTitle, setExperienceJobTitle] = useState("");
	const [experienceStartDate, setExperienceStartDate] = useState("");
	const [experienceEndDate, setExperienceEndDate] = useState("");
	const [workExperienceError, setWorkExperienceError] = useState<string | null>(null);
	const [editingWorkExperienceId, setEditingWorkExperienceId] = useState<number | null>(null);

	const canUploadDocuments = hasPermission(user, "documents.upload");
	const canDeleteDocuments = hasPermission(user, "documents.delete");
	const canManageEmployment = hasPermission(user, "employees.update");
	const canDeleteEmployee = hasPermission(user, "employees.delete");
	const canAssignAssets = hasPermission(user, "assets.assign");
	const canReturnAssets = hasPermission(user, "assets.return");
	const canViewSalary = hasPermission(user, "salary.view");
	const canCreateSalary = hasPermission(user, "salary.create");
	const canDeleteSalary = hasPermission(user, "salary.delete");
	const canViewQualifications = hasPermission(user, "qualifications.view");
	const canCreateQualifications = hasPermission(user, "qualifications.create");
	const canUpdateQualifications = hasPermission(user, "qualifications.update");
	const canDeleteQualifications = hasPermission(user, "qualifications.delete");
	const canViewWorkExperiences = hasPermission(user, "work_experiences.view");
	const canCreateWorkExperiences = hasPermission(user, "work_experiences.create");
	const canUpdateWorkExperiences = hasPermission(user, "work_experiences.update");
	const canDeleteWorkExperiences = hasPermission(user, "work_experiences.delete");

	// ── Queries ────────────────────────────────────────────────────────────────

	const { data: employee } = useQuery({
		queryKey: ["employee", employeeId],
		queryFn: () => apiFetch<{ data: Employee }>(`/employees/${employeeId}`).then((r) => r.data),
		enabled: !!employeeId && !loading && !forbidden,
	});

	const { data: records = [] } = useQuery({
		queryKey: ["employment-records", employeeId],
		queryFn: () => apiFetch<{ data: EmploymentRecord[] }>(`/employment-records?employee_id=${employeeId}`).then((r) => r.data ?? []),
		enabled: !!employeeId && !loading && !forbidden,
	});

	const { data: documents = [] } = useQuery({
		queryKey: ["documents", employeeId],
		queryFn: () => apiFetch<{ data: Array<{ id: number; title: string; original_name: string; document_type: string }> }>(`/documents?employee_id=${employeeId}`).then((r) => r.data ?? []),
		enabled: !!employeeId && !loading && !forbidden && activeTab === "documents",
	});

	const { data: assignments = [] } = useQuery({
		queryKey: ["asset-assignments", employeeId],
		queryFn: () => apiFetch<{ data: Assignment[] }>(`/asset-assignments?employee_id=${employeeId}`).then((r) => r.data ?? []),
		enabled: !!employeeId && !loading && !forbidden && (activeTab === "assets" || activeTab === "history"),
	});

	const { data: availableAssets = [] } = useQuery({
		queryKey: ["assets-available"],
		queryFn: () => apiFetch<{ data: Asset[] }>("/assets?status=available").then((r) => r.data ?? []),
		enabled: !!employeeId && !loading && !forbidden && activeTab === "assets",
	});

	const { data: salaryAssignments = [] } = useQuery({
		queryKey: ["salary-assignments", employeeId],
		queryFn: () => apiFetch<{ data: SalaryAssignment[] }>(`/salary-assignments?employee_id=${employeeId}`).then((r) => r.data ?? []),
		enabled: !!employeeId && !loading && !forbidden && canViewSalary && (activeTab === "salary" || activeTab === "history"),
	});

	const { data: qualifications = [] } = useQuery({
		queryKey: ["qualifications", employeeId],
		queryFn: () => apiFetch<{ data: Qualification[] }>(`/qualifications?employee_id=${employeeId}`).then((r) => r.data ?? []),
		enabled: !!employeeId && !loading && !forbidden && canViewQualifications && activeTab === "qualifications",
	});

	const { data: workExperiences = [] } = useQuery({
		queryKey: ["work-experiences", employeeId],
		queryFn: () => apiFetch<{ data: WorkExperience[] }>(`/work-experiences?employee_id=${employeeId}`).then((r) => r.data ?? []),
		enabled: !!employeeId && !loading && !forbidden && canViewWorkExperiences && activeTab === "work",
	});

	const { data: directorates = [] } = useQuery({
		queryKey: ["directorates"],
		queryFn: () => apiFetch<{ data: Directorate[] }>("/directorates?per_page=500").then((r) => r.data ?? []),
		enabled: !!employeeId && !loading && !forbidden && activeTab === "employment",
		staleTime: 1000 * 60 * 10,
	});

	const { data: jobFunctions = [] } = useQuery({
		queryKey: ["job-functions"],
		queryFn: () => apiFetch<{ data: JobFunction[] }>("/job-functions?per_page=500").then((r) => r.data ?? []),
		enabled: !!employeeId && !loading && !forbidden && activeTab === "employment",
		staleTime: 1000 * 60 * 10,
	});

	const { data: departments = [], isFetching: departmentsLoading } = useQuery({
		queryKey: ["departments", directorateId],
		queryFn: () => apiFetch<{ data: Department[] }>(
			directorateId ? `/departments?per_page=1000&directorate_id=${directorateId}` : "/departments?per_page=250"
		).then((r) => r.data ?? []),
		enabled: !!employeeId && !loading && !forbidden && activeTab === "employment",
	});

	// ── Mutations ──────────────────────────────────────────────────────────────

	const updateEmployee = useMutation({
		mutationFn: (values: EmployeeFormValues) => {
			if (values.profile_photo) {
				const formData = new FormData();
				formData.append("_method", "PATCH");
				formData.append("employee_number", values.employee_number);
				formData.append("first_name", values.first_name);
				formData.append("last_name", values.last_name);
				if (values.email) formData.append("email", values.email);
				if (values.phone) formData.append("phone", values.phone);
				if (values.address) formData.append("address", values.address);
				if (values.date_joined) formData.append("date_joined", values.date_joined);
				formData.append("status", values.status);
				formData.append("profile_photo", values.profile_photo);
				return apiFetch<{ data: Employee }>(`/employees/${employeeId}`, { method: "POST", body: formData });
			}
			return apiFetch<{ data: Employee }>(`/employees/${employeeId}`, {
				method: "PATCH",
				body: JSON.stringify({
					employee_number: values.employee_number,
					first_name: values.first_name,
					last_name: values.last_name,
					email: values.email || null,
					phone: values.phone || null,
					address: values.address || null,
					date_joined: values.date_joined || null,
					status: values.status,
				}),
			});
		},
		onSuccess: (response) => {
			queryClient.setQueryData(["employee", employeeId], response.data);
		},
		onError: (err) => setError(getErrorMessage(err, "Medewerker kon niet worden opgeslagen.")),
	});

	const deleteEmployee = useMutation({
		mutationFn: () => apiFetch<{ message: string }>(`/employees/${employeeId}`, { method: "DELETE" }),
		onSuccess: () => router.push("/employees"),
		onError: (err) => setError(getErrorMessage(err, "Medewerker kon niet worden verwijderd.")),
	});

	const createEmployment = useMutation({
		mutationFn: () =>
			apiFetch<{ data: EmploymentRecord }>("/employment-records", {
				method: "POST",
				body: JSON.stringify({
					employee_id: Number(employeeId),
					directorate_id: Number(directorateId),
					department_id: Number(departmentId),
					job_function_id: jobFunctionId ? Number(jobFunctionId) : null,
					start_date: startDate,
					employment_type: employmentType,
					status: "active",
				}),
			}),
		onSuccess: () => {
			setDirectorateId("");
			setDepartmentId("");
			setJobFunctionId("");
			setStartDate("");
			// Refresh both the employment records AND the employee profile (for current_employment)
			void queryClient.invalidateQueries({ queryKey: ["employment-records", employeeId] });
			void queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
		},
		onError: (err) => setError(getErrorMessage(err, "Dienstverband kon niet worden opgeslagen.")),
	});

	const deleteEmployment = useMutation({
		mutationFn: (id: number) => apiFetch<{ message: string }>(`/employment-records/${id}`, { method: "DELETE" }),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["employment-records", employeeId] });
			void queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
		},
		onError: (err) => setError(getErrorMessage(err, "Dienstverband kon niet worden verwijderd.")),
	});

	const uploadDocument = useMutation({
		mutationFn: (formData: FormData) =>
			apiFetch<{ data: { id: number; title: string; original_name: string; document_type: string } }>("/documents", { method: "POST", body: formData }),
		onSuccess: () => {
			setDocumentTitle("");
			setDocumentType("");
			setDocumentFile(null);
			void queryClient.invalidateQueries({ queryKey: ["documents", employeeId] });
		},
		onError: (err) => setError(getErrorMessage(err, "Document kon niet worden geüpload.")),
	});

	const deleteDocument = useMutation({
		mutationFn: (id: number) => apiFetch<{ message: string }>(`/documents/${id}`, { method: "DELETE" }),
		onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["documents", employeeId] }),
		onError: (err) => setError(getErrorMessage(err, "Document kon niet worden verwijderd.")),
	});

	const assignAsset = useMutation({
		mutationFn: () =>
			apiFetch<{ data: Assignment }>("/asset-assignments", {
				method: "POST",
				body: JSON.stringify({ employee_id: Number(employeeId), asset_id: Number(assetId) }),
			}),
		onSuccess: () => {
			setAssetId("");
			void queryClient.invalidateQueries({ queryKey: ["asset-assignments", employeeId] });
			void queryClient.invalidateQueries({ queryKey: ["assets-available"] });
		},
		onError: (err) => setError(getErrorMessage(err, "Asset kon niet worden toegewezen.")),
	});

	const returnAssignment = useMutation({
		mutationFn: (id: number) => apiFetch<{ data: Assignment }>(`/asset-assignments/${id}/return`, { method: "PATCH" }),
		onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["asset-assignments", employeeId] }),
		onError: (err) => setError(getErrorMessage(err, "Asset kon niet worden teruggegeven.")),
	});

	const deleteAssignment = useMutation({
		mutationFn: (id: number) => apiFetch<{ message: string }>(`/asset-assignments/${id}`, { method: "DELETE" }),
		onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["asset-assignments", employeeId] }),
		onError: (err) => setError(getErrorMessage(err, "Asset-toewijzing kon niet worden verwijderd.")),
	});

	const createSalary = useMutation({
		mutationFn: () =>
			apiFetch<{ data: SalaryAssignment }>("/salary-assignments", {
				method: "POST",
				body: JSON.stringify({
					employee_id: Number(employeeId),
					amount: Number(salaryAmount),
					currency: salaryCurrency,
					start_date: salaryStartDate,
					status: "active",
				}),
			}),
		onSuccess: () => {
			setSalaryAmount("");
			setSalaryCurrency("SRD");
			setSalaryStartDate("");
			void queryClient.invalidateQueries({ queryKey: ["salary-assignments", employeeId] });
		},
		onError: (err) => setError(getErrorMessage(err, "Salaris kon niet worden opgeslagen.")),
	});

	const deleteSalary = useMutation({
		mutationFn: (id: number) => apiFetch<{ message: string }>(`/salary-assignments/${id}`, { method: "DELETE" }),
		onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["salary-assignments", employeeId] }),
		onError: (err) => setError(getErrorMessage(err, "Salaristoewijzing kon niet worden verwijderd.")),
	});

	const saveQualification = useMutation({
		mutationFn: () => {
			if (editingQualificationId) {
				return apiFetch<{ data: Qualification }>(`/qualifications/${editingQualificationId}`, {
					method: "PATCH",
					body: JSON.stringify({
						name: qualificationName,
						institution: qualificationInstitution || null,
						obtained_date: qualificationObtainedDate || null,
						status: qualificationStatus,
					}),
				});
			}
			return apiFetch<{ data: Qualification }>("/qualifications", {
				method: "POST",
				body: JSON.stringify({
					employee_id: Number(employeeId),
					name: qualificationName,
					institution: qualificationInstitution || null,
					obtained_date: qualificationObtainedDate || null,
					status: qualificationStatus,
				}),
			});
		},
		onSuccess: () => {
			setQualificationName("");
			setQualificationInstitution("");
			setQualificationObtainedDate("");
			setQualificationStatus("valid");
			setEditingQualificationId(null);
			setQualificationError(null);
			void queryClient.invalidateQueries({ queryKey: ["qualifications", employeeId] });
		},
		onError: (err) => setQualificationError(getErrorMessage(err, "Kwalificatie kon niet worden opgeslagen.")),
	});

	const deleteQualification = useMutation({
		mutationFn: (id: number) => apiFetch<{ message: string }>(`/qualifications/${id}`, { method: "DELETE" }),
		onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["qualifications", employeeId] }),
		onError: (err) => setQualificationError(getErrorMessage(err, "Kwalificatie kon niet worden verwijderd.")),
	});

	const saveWorkExperience = useMutation({
		mutationFn: () => {
			if (editingWorkExperienceId) {
				return apiFetch<{ data: WorkExperience }>(`/work-experiences/${editingWorkExperienceId}`, {
					method: "PATCH",
					body: JSON.stringify({
						company_name: experienceCompanyName,
						job_title: experienceJobTitle,
						start_date: experienceStartDate,
						end_date: experienceEndDate || null,
					}),
				});
			}
			return apiFetch<{ data: WorkExperience }>("/work-experiences", {
				method: "POST",
				body: JSON.stringify({
					employee_id: Number(employeeId),
					company_name: experienceCompanyName,
					job_title: experienceJobTitle,
					start_date: experienceStartDate,
					end_date: experienceEndDate || null,
				}),
			});
		},
		onSuccess: () => {
			setExperienceCompanyName("");
			setExperienceJobTitle("");
			setExperienceStartDate("");
			setExperienceEndDate("");
			setEditingWorkExperienceId(null);
			setWorkExperienceError(null);
			void queryClient.invalidateQueries({ queryKey: ["work-experiences", employeeId] });
		},
		onError: (err) => setWorkExperienceError(getErrorMessage(err, "Werkervaring kon niet worden opgeslagen.")),
	});

	const deleteWorkExperience = useMutation({
		mutationFn: (id: number) => apiFetch<{ message: string }>(`/work-experiences/${id}`, { method: "DELETE" }),
		onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["work-experiences", employeeId] }),
		onError: (err) => setWorkExperienceError(getErrorMessage(err, "Werkervaring kon niet worden verwijderd.")),
	});

	// ── Event handlers ─────────────────────────────────────────────────────────

	function handleDocumentUpload(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!documentFile) return;
		const formData = new FormData();
		formData.append("employee_id", employeeId);
		formData.append("title", documentTitle);
		formData.append("document_type", documentType);
		formData.append("file", documentFile);
		uploadDocument.mutate(formData);
	}

	function handleEmploymentCreate(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		if (!directorateId || !departmentId) {
			setError("Selecteer eerst een directoraat en afdeling.");
			return;
		}
		createEmployment.mutate();
	}

	function handleQualificationCreate(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setQualificationError(null);
		if (!qualificationName.trim()) {
			setQualificationError("Naam van kwalificatie is verplicht.");
			return;
		}
		saveQualification.mutate();
	}

	function handleWorkExperienceCreate(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setWorkExperienceError(null);
		if (!experienceCompanyName.trim() || !experienceJobTitle.trim() || !experienceStartDate) {
			setWorkExperienceError("Bedrijf, functietitel en startdatum zijn verplicht.");
			return;
		}
		if (experienceEndDate && experienceEndDate < experienceStartDate) {
			setWorkExperienceError("Einddatum mag niet voor de startdatum liggen.");
			return;
		}
		saveWorkExperience.mutate();
	}

	function startQualificationEdit(item: Qualification) {
		setEditingQualificationId(item.id);
		setQualificationName(item.name);
		setQualificationInstitution(item.institution ?? "");
		setQualificationObtainedDate(item.obtained_date ?? "");
		setQualificationStatus(item.status);
		setQualificationError(null);
	}

	function cancelQualificationEdit() {
		setEditingQualificationId(null);
		setQualificationName("");
		setQualificationInstitution("");
		setQualificationObtainedDate("");
		setQualificationStatus("valid");
		setQualificationError(null);
	}

	function startWorkExperienceEdit(item: WorkExperience) {
		setEditingWorkExperienceId(item.id);
		setExperienceCompanyName(item.company_name);
		setExperienceJobTitle(item.job_title);
		setExperienceStartDate(item.start_date);
		setExperienceEndDate(item.end_date ?? "");
		setWorkExperienceError(null);
	}

	function cancelWorkExperienceEdit() {
		setEditingWorkExperienceId(null);
		setExperienceCompanyName("");
		setExperienceJobTitle("");
		setExperienceStartDate("");
		setExperienceEndDate("");
		setWorkExperienceError(null);
	}

	// ── Render ─────────────────────────────────────────────────────────────────

	if (loading) return <main style={{ padding: "1.5rem" }}><p>Laden...</p></main>;
	if (forbidden) return <main style={{ padding: "1.5rem" }}><p>Je hebt geen rechten om medewerkers te bekijken.</p></main>;

	const activeEmployment = employee?.current_employment ?? records.find((r) => r.status === "active") ?? null;
	const employmentSummary = activeEmployment?.start_date
		? `${getEmploymentTypeLabel(activeEmployment.employment_type)} sinds ${activeEmployment.start_date}`
		: activeEmployment ? getEmploymentTypeLabel(activeEmployment.employment_type) : null;

	const tabs: Array<{ id: EmployeeTab; label: string; visible: boolean }> = [
		{ id: "profile", label: "Profiel", visible: true },
		{ id: "employment", label: "Werkgegevens", visible: true },
		{ id: "documents", label: "Dossier", visible: true },
		{ id: "qualifications", label: "Kwalificaties", visible: canViewQualifications },
		{ id: "work", label: "Werkervaring", visible: canViewWorkExperiences },
		{ id: "salary", label: "Salaris", visible: canViewSalary },
		{ id: "assets", label: "Bedrijfsmiddelen", visible: true },
		{ id: "history", label: "Historiek", visible: true },
	];

	return (
		<ModuleFrame
			title={employee ? `${employee.first_name} ${employee.last_name}` : "Medewerker"}
			kicker="Medewerkerdetails"
			icon="👤"
			subtitle={employee ? `${employee.employee_number} · ${getEmployeeStatusLabel(employee.status)}` : ""}
		>
			{error && <p className="error">{error}</p>}

			<div className="tabs">
				{tabs.filter((tab) => tab.visible).map((tab) => (
					<button key={tab.id} type="button" className={`tab-btn${activeTab === tab.id ? " active" : ""}`} onClick={() => setActiveTab(tab.id)}>
						{tab.label}
					</button>
				))}
			</div>

			{activeTab === "profile" && employee && (
				<section className="grid">
					{canManageEmployment ? (
						<>
							<EmployeeForm
								initialValues={{
									employee_number: employee.employee_number,
									first_name: employee.first_name,
									last_name: employee.last_name,
									email: employee.email ?? "",
									phone: employee.phone ?? "",
									address: employee.address ?? "",
									profile_photo: null,
									date_joined: employee.date_joined ?? "",
									status: employee.status,
								}}
								existingPhotoUrl={employee.profile_photo_url}
								displayName={`${employee.first_name} ${employee.last_name}`}
								statusLabel={getEmployeeStatusLabel(employee.status)}
								statusClass={`status-${employee.status}`}
								departmentName={activeEmployment?.department_name ?? null}
								directorateName={activeEmployment?.directorate_name ?? null}
								jobFunctionTitle={activeEmployment?.job_function_title ?? null}
								employmentSummary={employmentSummary}
								onSubmit={(values) => { updateEmployee.mutate(values); return Promise.resolve(); }}
								submitLabel={updateEmployee.isPending ? "Opslaan..." : "Medewerker opslaan"}
							/>
							{canDeleteEmployee && (
								<button
									className="btn secondary"
									type="button"
									style={{ marginTop: "1rem" }}
									onClick={() => {
										if (!confirm("Weet u zeker dat u deze medewerker wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.")) return;
										deleteEmployee.mutate();
									}}
								>
									Medewerker verwijderen
								</button>
							)}
						</>
					) : (
						<div className="employee-profile-header">
							<div style={{ width: 96, height: 96, borderRadius: "50%", background: "#e8e2d8", display: "grid", placeItems: "center", fontSize: "2.2rem", flexShrink: 0 }}>
								{employee.profile_photo_url
									? <img src={employee.profile_photo_url} alt="" style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover" }} />
									: "👤"}
							</div>
							<div>
								<h2 className="employee-profile-name">{employee.first_name} {employee.last_name}</h2>
								<div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.3rem" }}>
									<span className={`employee-status-pill status-${employee.status}`}>{getEmployeeStatusLabel(employee.status)}</span>
									<span className="muted" style={{ fontSize: "0.82rem" }}>{employee.employee_number}</span>
								</div>
								<div className="employee-profile-dept" style={{ marginTop: "0.5rem" }}>
									<span className="employee-profile-dept-label">Afdeling</span>
									{activeEmployment?.department_name ?? "Niet gekoppeld"}
								</div>
								<div className="employee-profile-dept">
									<span className="employee-profile-dept-label">Directoraat</span>
									{activeEmployment?.directorate_name ?? "—"}
								</div>
								<div className="employee-profile-dept">
									<span className="employee-profile-dept-label">Functie</span>
									{activeEmployment?.job_function_title ?? "—"}
								</div>
								<div className="employee-profile-dept">
									<span className="employee-profile-dept-label">Dienstverband</span>
									{employmentSummary ?? "—"}
								</div>
							</div>
						</div>
					)}
				</section>
			)}

			{activeTab === "employment" && (
				<section className="grid">
					<h2 style={{ marginTop: 0 }}>Werkgegevens en dienstverbanden</h2>
					<div className="list-row" style={{ justifyContent: "flex-end" }}>
						<button
							className="btn secondary"
							type="button"
							onClick={() => {
								void queryClient.invalidateQueries({ queryKey: ["employment-records", employeeId] });
								void queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
							}}
						>
							Lijsten verversen
						</button>
					</div>
					{canManageEmployment && (
						<form onSubmit={handleEmploymentCreate} className="filter-row">
							<select
								value={directorateId}
								onChange={(event) => {
									setDirectorateId(event.target.value);
									setDepartmentId("");
								}}
							>
								<option value="">Selecteer directoraat</option>
								{directorates.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
							</select>
							<select
								disabled={departmentsLoading}
								value={departmentId}
								onChange={(event) => setDepartmentId(event.target.value)}
							>
								<option value="">{departmentsLoading ? "Afdelingen laden..." : "Selecteer afdeling"}</option>
								{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
							</select>
							<select value={jobFunctionId} onChange={(event) => setJobFunctionId(event.target.value)}>
								<option value="">Selecteer functie</option>
								{jobFunctions.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
							</select>
							<input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required />
							<select value={employmentType} onChange={(event) => setEmploymentType(event.target.value)}>
								<option value="permanent">Vaste dienst</option>
								<option value="contract">Overeenkomst</option>
								<option value="temporary">Tijdelijke dienst</option>
							</select>
							<button className="btn" type="submit" disabled={createEmployment.isPending}>
								{createEmployment.isPending ? "Bezig..." : "Dienstverband toevoegen"}
							</button>
						</form>
					)}
					<div className="list-grid">
						{records.map((item) => (
							<div key={item.id} className="list-row">
								<div>
									<strong>{item.directorate_name ?? "Geen directoraat"}</strong>
									{item.department_name ? ` › ${item.department_name}` : ""}
									{item.job_function_title ? ` — ${item.job_function_title}` : ""}
									{` — ${getEmploymentTypeLabel(item.employment_type)} — ${item.start_date}`}
									{item.status === "active" && <span style={{ marginLeft: "0.5rem", color: "green", fontSize: "0.8rem" }}>● Actief</span>}
								</div>
								<div className="list-row-actions">
									{canManageEmployment && (
										<button className="btn secondary" type="button" onClick={() => {
											if (!confirm("Weet u zeker dat u dit dienstverband wilt verwijderen?")) return;
											deleteEmployment.mutate(item.id);
										}}>
											Verwijderen
										</button>
									)}
								</div>
							</div>
						))}
					</div>
				</section>
			)}

			{activeTab === "documents" && (
				<section className="grid">
					<h2 style={{ marginTop: 0 }}>Dossier</h2>
					{canUploadDocuments && (
						<form onSubmit={handleDocumentUpload} className="grid" style={{ maxWidth: "500px" }}>
							<input value={documentTitle} onChange={(event) => setDocumentTitle(event.target.value)} placeholder="Titel" required />
							<input value={documentType} onChange={(event) => setDocumentType(event.target.value)} placeholder="Documenttype" required />
							<input type="file" onChange={(event) => setDocumentFile(event.target.files?.[0] ?? null)} required />
							<button className="btn" type="submit" disabled={uploadDocument.isPending}>
								{uploadDocument.isPending ? "Uploaden..." : "Document uploaden"}
							</button>
						</form>
					)}
					<div className="list-grid">
						{documents.map((item) => (
							<div key={item.id} className="list-row">
								<div>{item.title} - {item.document_type} - {item.original_name}</div>
								<div className="list-row-actions">
									{canDeleteDocuments && (
										<button className="btn secondary" type="button" onClick={() => {
											if (!confirm("Weet u zeker dat u dit document wilt verwijderen?")) return;
											deleteDocument.mutate(item.id);
										}}>
											Verwijderen
										</button>
									)}
								</div>
							</div>
						))}
					</div>
				</section>
			)}

			{activeTab === "qualifications" && canViewQualifications && (
				<section className="grid">
					<h2 style={{ marginTop: 0 }}>Kwalificaties</h2>
					{(canCreateQualifications || canUpdateQualifications) && (
						<form onSubmit={handleQualificationCreate} className="filter-row">
							<input value={qualificationName} onChange={(event) => setQualificationName(event.target.value)} placeholder="Kwalificatie" required />
							<input value={qualificationInstitution} onChange={(event) => setQualificationInstitution(event.target.value)} placeholder="Instelling" />
							<input type="date" value={qualificationObtainedDate} onChange={(event) => setQualificationObtainedDate(event.target.value)} />
							<select value={qualificationStatus} onChange={(event) => setQualificationStatus(event.target.value)}>
								<option value="valid">Geldig</option>
								<option value="pending">In behandeling</option>
								<option value="expired">Verlopen</option>
								<option value="revoked">Ingetrokken</option>
							</select>
							<button className="btn" type="submit" disabled={saveQualification.isPending}>
								{editingQualificationId ? "Kwalificatie opslaan" : "Kwalificatie toevoegen"}
							</button>
							{editingQualificationId && <button className="btn secondary" type="button" onClick={cancelQualificationEdit}>Annuleren</button>}
						</form>
					)}
					{qualificationError && <p className="error">{qualificationError}</p>}
					<div className="list-grid">
						{qualifications.map((item) => (
							<div key={item.id} className="list-row">
								<div>{item.name} - {item.institution ?? "Geen instelling"} - {item.status}{item.obtained_date ? ` - ${item.obtained_date}` : ""}</div>
								<div className="list-row-actions">
									{canUpdateQualifications && <button className="btn secondary" type="button" onClick={() => startQualificationEdit(item)}>Bewerken</button>}
									{canDeleteQualifications && (
										<button className="btn secondary" type="button" onClick={() => {
											if (!confirm("Weet u zeker dat u deze kwalificatie wilt verwijderen?")) return;
											deleteQualification.mutate(item.id);
										}}>
											Verwijderen
										</button>
									)}
								</div>
							</div>
						))}
					</div>
				</section>
			)}

			{activeTab === "work" && canViewWorkExperiences && (
				<section className="grid">
					<h2 style={{ marginTop: 0 }}>Werkervaring</h2>
					{(canCreateWorkExperiences || canUpdateWorkExperiences) && (
						<form onSubmit={handleWorkExperienceCreate} className="filter-row">
							<input value={experienceCompanyName} onChange={(event) => setExperienceCompanyName(event.target.value)} placeholder="Bedrijf" required />
							<input value={experienceJobTitle} onChange={(event) => setExperienceJobTitle(event.target.value)} placeholder="Functietitel" required />
							<input type="date" value={experienceStartDate} onChange={(event) => setExperienceStartDate(event.target.value)} required />
							<input type="date" value={experienceEndDate} onChange={(event) => setExperienceEndDate(event.target.value)} />
							<button className="btn" type="submit" disabled={saveWorkExperience.isPending}>
								{editingWorkExperienceId ? "Werkervaring opslaan" : "Werkervaring toevoegen"}
							</button>
							{editingWorkExperienceId && <button className="btn secondary" type="button" onClick={cancelWorkExperienceEdit}>Annuleren</button>}
						</form>
					)}
					{workExperienceError && <p className="error">{workExperienceError}</p>}
					<div className="list-grid">
						{workExperiences.map((item) => (
							<div key={item.id} className="list-row">
								<div>{item.company_name} - {item.job_title} - {item.start_date}{item.end_date ? ` tot ${item.end_date}` : ""}</div>
								<div className="list-row-actions">
									{canUpdateWorkExperiences && <button className="btn secondary" type="button" onClick={() => startWorkExperienceEdit(item)}>Bewerken</button>}
									{canDeleteWorkExperiences && (
										<button className="btn secondary" type="button" onClick={() => {
											if (!confirm("Weet u zeker dat u deze werkervaring wilt verwijderen?")) return;
											deleteWorkExperience.mutate(item.id);
										}}>
											Verwijderen
										</button>
									)}
								</div>
							</div>
						))}
					</div>
				</section>
			)}

			{activeTab === "salary" && canViewSalary && (
				<section className="grid">
					<h2 style={{ marginTop: 0 }}>Salaris</h2>
					{canCreateSalary && (
						<form onSubmit={(e) => { e.preventDefault(); createSalary.mutate(); }} className="filter-row">
							<input type="number" min="0" step="0.01" value={salaryAmount} onChange={(event) => setSalaryAmount(event.target.value)} placeholder="Salarisbedrag" required />
							<select value={salaryCurrency} onChange={(event) => setSalaryCurrency(event.target.value)}>
								<option value="SRD">SRD</option>
								<option value="USD">USD</option>
								<option value="EUR">EUR</option>
							</select>
							<input type="date" value={salaryStartDate} onChange={(event) => setSalaryStartDate(event.target.value)} required />
							<button className="btn" type="submit" disabled={createSalary.isPending}>
								{createSalary.isPending ? "Bezig..." : "Salaris toevoegen"}
							</button>
						</form>
					)}
					<div className="list-grid">
						{salaryAssignments.map((item) => (
							<div key={item.id} className="list-row">
								<div>{item.amount} {item.currency} - {item.start_date} - {item.status}</div>
								<div className="list-row-actions">
									{canDeleteSalary && (
										<button className="btn secondary" type="button" onClick={() => {
											if (!confirm("Weet u zeker dat u deze salaristoewijzing wilt verwijderen?")) return;
											deleteSalary.mutate(item.id);
										}}>
											Verwijderen
										</button>
									)}
								</div>
							</div>
						))}
					</div>
				</section>
			)}

			{activeTab === "assets" && (
				<section className="grid">
					<h2 style={{ marginTop: 0 }}>Bedrijfsmiddelen</h2>
					{canAssignAssets && (
						<form onSubmit={(e) => { e.preventDefault(); assignAsset.mutate(); }} className="filter-row">
							<select value={assetId} onChange={(event) => setAssetId(event.target.value)} required>
								<option value="">Selecteer asset</option>
								{availableAssets.map((asset) => <option key={asset.id} value={asset.id}>{asset.asset_tag} - {asset.name}</option>)}
							</select>
							<button className="btn" type="submit" disabled={assignAsset.isPending}>Asset toewijzen</button>
						</form>
					)}
					<div className="list-grid">
						{assignments.map((item) => (
							<div key={item.id} className="list-row">
								<div>{item.asset_tag ?? "-"} - {item.asset_name ?? "Onbekende asset"} - {item.status}</div>
								<div className="list-row-actions">
									{canReturnAssets && item.status === "assigned" && (
										<button className="btn secondary" type="button" onClick={() => returnAssignment.mutate(item.id)}>Terugnemen</button>
									)}
									{canReturnAssets && (
										<button className="btn secondary" type="button" onClick={() => {
											if (!confirm("Weet u zeker dat u deze asset-toewijzing wilt verwijderen?")) return;
											deleteAssignment.mutate(item.id);
										}}>
											Verwijderen
										</button>
									)}
								</div>
							</div>
						))}
					</div>
				</section>
			)}

			{activeTab === "history" && (
				<section className="grid">
					<h2 style={{ marginTop: 0 }}>Historiek</h2>
					<p className="muted">Chronologisch overzicht van relevante wijzigingen.</p>
					<div className="list-grid">
						{records.map((item) => (
							<div key={`employment-${item.id}`} className="list-row">
								<div>Dienstverband: {item.directorate_name ?? "Onbekend"}{item.department_name ? ` › ${item.department_name}` : ""} ({item.start_date})</div>
							</div>
						))}
						{salaryAssignments.map((item) => (
							<div key={`salary-${item.id}`} className="list-row">
								<div>Salaris bijgewerkt: {item.amount} {item.currency} ({item.start_date})</div>
							</div>
						))}
						{assignments.map((item) => (
							<div key={`asset-${item.id}`} className="list-row">
								<div>Asset {item.status}: {item.asset_tag ?? "-"} ({item.assigned_at})</div>
							</div>
						))}
					</div>
				</section>
			)}
		</ModuleFrame>
	);
}

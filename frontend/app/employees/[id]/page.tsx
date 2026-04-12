"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
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
};

type Position = {
	id: number;
	title: string;
	department_id: number | null;
	department_name: string | null;
	directorate_id: number | null;
	directorate_name: string | null;
	job_function_id: number | null;
	job_function_title: string | null;
};
type Directorate = { id: number; name: string };
type Department = { id: number; name: string; directorate_id: number | null };
type JobFunction = { id: number; title: string };
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

type EmployeeTab = "profile" | "employment" | "documents" | "qualifications" | "work" | "salary" | "assets" | "history";
type DetailSection = "profile" | "employment" | "documents" | "qualifications" | "work" | "salary" | "assets";

export default function EmployeeDetailPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const employeeId = params.id;
	const { user, loading, forbidden } = useAuthGuard("employees.view");
	const [employee, setEmployee] = useState<Employee | null>(null);
	const [documents, setDocuments] = useState<Array<{ id: number; title: string; original_name: string; document_type: string }>>([]);
	const [records, setRecords] = useState<Array<{ id: number; position_title: string | null; job_function_id: number | null; job_function_title: string | null; department_name: string | null; directorate_name: string | null; start_date: string; end_date: string | null; employment_type: string; status: string }>>([]);
	const [assignments, setAssignments] = useState<Array<{ id: number; asset_name: string | null; asset_tag: string | null; status: string; assigned_at: string; returned_at: string | null }>>([]);
	const [salaryAssignments, setSalaryAssignments] = useState<Array<{ id: number; amount: string; currency: string; start_date: string; end_date: string | null; status: string }>>([]);
	const [qualifications, setQualifications] = useState<Qualification[]>([]);
	const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
	const [positions, setPositions] = useState<Position[]>([]);
	const [directorates, setDirectorates] = useState<Directorate[]>([]);
	const [departments, setDepartments] = useState<Department[]>([]);
	const [jobFunctions, setJobFunctions] = useState<JobFunction[]>([]);
	const [assets, setAssets] = useState<Asset[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [savingEmployee, setSavingEmployee] = useState(false);
	const [documentTitle, setDocumentTitle] = useState("");
	const [documentType, setDocumentType] = useState("");
	const [documentFile, setDocumentFile] = useState<File | null>(null);
	const [positionId, setPositionId] = useState("");
	const [directorateId, setDirectorateId] = useState("");
	const [departmentId, setDepartmentId] = useState("");
	const [jobFunctionId, setJobFunctionId] = useState("");
	const [employmentType, setEmploymentType] = useState("permanent");
	const [startDate, setStartDate] = useState("");
	const [assetId, setAssetId] = useState("");
	const [salaryAmount, setSalaryAmount] = useState("");
	const [salaryCurrency, setSalaryCurrency] = useState("SRD");
	const [salaryStartDate, setSalaryStartDate] = useState("");
	const [qualificationName, setQualificationName] = useState("");
	const [qualificationInstitution, setQualificationInstitution] = useState("");
	const [qualificationObtainedDate, setQualificationObtainedDate] = useState("");
	const [qualificationStatus, setQualificationStatus] = useState("valid");
	const [qualificationError, setQualificationError] = useState<string | null>(null);
	const [editingQualificationId, setEditingQualificationId] = useState<number | null>(null);
	const [experienceCompanyName, setExperienceCompanyName] = useState("");
	const [experienceJobTitle, setExperienceJobTitle] = useState("");
	const [experienceStartDate, setExperienceStartDate] = useState("");
	const [experienceEndDate, setExperienceEndDate] = useState("");
	const [workExperienceError, setWorkExperienceError] = useState<string | null>(null);
	const [editingWorkExperienceId, setEditingWorkExperienceId] = useState<number | null>(null);
	const [activeTab, setActiveTab] = useState<EmployeeTab>("profile");
	const [loadedSections, setLoadedSections] = useState<Record<DetailSection, boolean>>({
		profile: false,
		employment: false,
		documents: false,
		qualifications: false,
		work: false,
		salary: false,
		assets: false,
	});
	const loadingSectionsRef = useRef<Set<DetailSection>>(new Set());

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

	function getErrorMessage(err: unknown, fallback: string): string {
		if (err instanceof ApiError && err.message) {
			return err.message;
		}

		if (err instanceof Error && err.message) {
			return err.message;
		}

		return fallback;
	}

	const loadProfileData = useCallback(async () => {
		if (!employeeId || loadedSections.profile || loadingSectionsRef.current.has("profile")) {
			return;
		}

		loadingSectionsRef.current.add("profile");
		try {
			const employeeResponse = await apiFetch<{ data: Employee }>(`/employees/${employeeId}`);
			setEmployee(employeeResponse.data);
			setLoadedSections((current) => ({ ...current, profile: true }));
		} catch {
			setError("Employee details konden niet worden geladen.");
		} finally {
			loadingSectionsRef.current.delete("profile");
		}
	}, [employeeId, loadedSections.profile]);

	const loadEmploymentData = useCallback(async () => {
		if (!employeeId || loadedSections.employment || loadingSectionsRef.current.has("employment")) {
			return;
		}

		loadingSectionsRef.current.add("employment");
		try {
			const [recordsResponse, positionsResponse, directoratesResponse, departmentsResponse, jobFunctionsResponse] = await Promise.all([
				apiFetch<{ data: Array<{ id: number; position_title: string | null; job_function_id: number | null; job_function_title: string | null; department_name: string | null; directorate_name: string | null; start_date: string; end_date: string | null; employment_type: string; status: string }> }>(`/employment-records?employee_id=${employeeId}`),
				apiFetch<{ data: Position[] }>("/positions?per_page=500"),
				apiFetch<{ data: Directorate[] }>("/directorates?per_page=200"),
				apiFetch<{ data: Department[] }>("/departments?per_page=500"),
				apiFetch<{ data: JobFunction[] }>("/job-functions?per_page=500"),
			]);

			setRecords(recordsResponse.data ?? []);
			setPositions(positionsResponse.data ?? []);
			setDirectorates(directoratesResponse.data ?? []);
			setDepartments(departmentsResponse.data ?? []);
			setJobFunctions(jobFunctionsResponse.data ?? []);
			setLoadedSections((current) => ({ ...current, employment: true }));
		} catch {
			setError("Werkgegevens konden niet worden geladen.");
		} finally {
			loadingSectionsRef.current.delete("employment");
		}
	}, [employeeId, loadedSections.employment]);

	const loadDocumentsData = useCallback(async () => {
		if (!employeeId || loadedSections.documents || loadingSectionsRef.current.has("documents")) {
			return;
		}

		loadingSectionsRef.current.add("documents");
		try {
			const documentsResponse = await apiFetch<{ data: Array<{ id: number; title: string; original_name: string; document_type: string }> }>(`/documents?employee_id=${employeeId}`);
			setDocuments(documentsResponse.data ?? []);
			setLoadedSections((current) => ({ ...current, documents: true }));
		} catch {
			setError("Documenten konden niet worden geladen.");
		} finally {
			loadingSectionsRef.current.delete("documents");
		}
	}, [employeeId, loadedSections.documents]);

	const loadAssetsData = useCallback(async () => {
		if (!employeeId || loadedSections.assets || loadingSectionsRef.current.has("assets")) {
			return;
		}

		loadingSectionsRef.current.add("assets");
		try {
			const [assignmentsResponse, assetsResponse] = await Promise.all([
				apiFetch<{ data: Array<{ id: number; asset_name: string | null; asset_tag: string | null; status: string; assigned_at: string; returned_at: string | null }> }>(`/asset-assignments?employee_id=${employeeId}`),
				apiFetch<{ data: Asset[] }>("/assets?status=available"),
			]);

			setAssignments(assignmentsResponse.data ?? []);
			setAssets(assetsResponse.data ?? []);
			setLoadedSections((current) => ({ ...current, assets: true }));
		} catch {
			setError("Assets konden niet worden geladen.");
		} finally {
			loadingSectionsRef.current.delete("assets");
		}
	}, [employeeId, loadedSections.assets]);

	const loadSalaryData = useCallback(async () => {
		if (!employeeId || loadedSections.salary || loadingSectionsRef.current.has("salary")) {
			return;
		}

		loadingSectionsRef.current.add("salary");
		try {
			const salaryResponse = await apiFetch<{ data: Array<{ id: number; amount: string; currency: string; start_date: string; end_date: string | null; status: string }> }>(`/salary-assignments?employee_id=${employeeId}`);
			setSalaryAssignments(salaryResponse.data ?? []);
			setLoadedSections((current) => ({ ...current, salary: true }));
		} catch {
			setError("Salarisgegevens konden niet worden geladen.");
		} finally {
			loadingSectionsRef.current.delete("salary");
		}
	}, [employeeId, loadedSections.salary]);

	const loadQualificationsData = useCallback(async () => {
		if (!employeeId || loadedSections.qualifications || loadingSectionsRef.current.has("qualifications")) {
			return;
		}

		loadingSectionsRef.current.add("qualifications");
		try {
			const qualificationsResponse = await apiFetch<{ data: Qualification[] }>(`/qualifications?employee_id=${employeeId}`);
			setQualifications(qualificationsResponse.data ?? []);
			setLoadedSections((current) => ({ ...current, qualifications: true }));
		} catch {
			setError("Kwalificaties konden niet worden geladen.");
		} finally {
			loadingSectionsRef.current.delete("qualifications");
		}
	}, [employeeId, loadedSections.qualifications]);

	const loadWorkExperiencesData = useCallback(async () => {
		if (!employeeId || loadedSections.work || loadingSectionsRef.current.has("work")) {
			return;
		}

		loadingSectionsRef.current.add("work");
		try {
			const workExperiencesResponse = await apiFetch<{ data: WorkExperience[] }>(`/work-experiences?employee_id=${employeeId}`);
			setWorkExperiences(workExperiencesResponse.data ?? []);
			setLoadedSections((current) => ({ ...current, work: true }));
		} catch {
			setError("Werkervaring kon niet worden geladen.");
		} finally {
			loadingSectionsRef.current.delete("work");
		}
	}, [employeeId, loadedSections.work]);

	useEffect(() => {
		if (loading || forbidden || !employeeId) {
			return;
		}

		void loadProfileData();
	}, [employeeId, forbidden, loading, loadProfileData]);

	useEffect(() => {
		if (loading || forbidden || !employeeId) {
			return;
		}

		if (activeTab === "documents") {
			void loadDocumentsData();
			return;
		}

		if (activeTab === "employment") {
			void loadEmploymentData();
			return;
		}

		if (activeTab === "assets") {
			void loadAssetsData();
			return;
		}

		if (activeTab === "salary" && canViewSalary) {
			void loadSalaryData();
			return;
		}

		if (activeTab === "qualifications" && canViewQualifications) {
			void loadQualificationsData();
			return;
		}

		if (activeTab === "work" && canViewWorkExperiences) {
			void loadWorkExperiencesData();
			return;
		}

		if (activeTab === "history") {
			void loadEmploymentData();
			void loadSalaryData();
			void loadAssetsData();
		}
	}, [
		activeTab,
		employeeId,
		forbidden,
		loading,
		canViewQualifications,
		canViewSalary,
		canViewWorkExperiences,
		loadAssetsData,
		loadDocumentsData,
		loadEmploymentData,
		loadQualificationsData,
		loadSalaryData,
		loadWorkExperiencesData,
	]);

	async function handleEmployeeUpdate(values: EmployeeFormValues) {
		setSavingEmployee(true);
		setError(null);

		try {
			const updated = values.profile_photo
				? await apiFetch<{ data: Employee }>(`/employees/${employeeId}`, {
					method: "POST",
					body: (() => {
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
						return formData;
					})(),
				})
				: await apiFetch<{ data: Employee }>(`/employees/${employeeId}`, {
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

			setEmployee(updated.data);
		} finally {
			setSavingEmployee(false);
		}
	}

	async function handleEmployeeDelete() {
		if (!employee) {
			return;
		}

		if (!confirm("Weet u zeker dat u deze medewerker wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.")) {
			return;
		}

		await apiFetch<{ message: string }>(`/employees/${employee.id}`, { method: "DELETE" });
		router.push("/employees");
	}

	async function handleDocumentUpload(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!documentFile) {
			return;
		}

		const formData = new FormData();
		formData.append("employee_id", employeeId);
		formData.append("title", documentTitle);
		formData.append("document_type", documentType);
		formData.append("file", documentFile);

		const created = await apiFetch<{ data: { id: number; title: string; original_name: string; document_type: string } }>("/documents", {
			method: "POST",
			body: formData,
		});

		setDocuments((prev) => [created.data, ...prev]);
		setDocumentTitle("");
		setDocumentType("");
		setDocumentFile(null);
	}

	async function handleDocumentDelete(id: number) {
		if (!confirm("Weet u zeker dat u dit document wilt verwijderen?")) {
			return;
		}

		await apiFetch<{ message: string }>(`/documents/${id}`, { method: "DELETE" });
		setDocuments((prev) => prev.filter((item) => item.id !== id));
	}

	async function handleEmploymentCreate(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const created = await apiFetch<{ data: { id: number; position_title: string | null; job_function_id: number | null; job_function_title: string | null; department_name: string | null; directorate_name: string | null; start_date: string; end_date: string | null; employment_type: string; status: string } }>("/employment-records", {
			method: "POST",
			body: JSON.stringify({
				employee_id: Number(employeeId),
				position_id: positionId ? Number(positionId) : null,
				job_function_id: jobFunctionId ? Number(jobFunctionId) : null,
				start_date: startDate,
				employment_type: employmentType,
				status: "active",
			}),
		});

		setRecords((prev) => [created.data, ...prev]);
		setPositionId("");
		setDirectorateId("");
		setDepartmentId("");
		setJobFunctionId("");
		setStartDate("");
	}

	async function handleEmploymentDelete(id: number) {
		if (!confirm("Weet u zeker dat u dit dienstverband wilt verwijderen?")) {
			return;
		}

		await apiFetch<{ message: string }>(`/employment-records/${id}`, { method: "DELETE" });
		setRecords((prev) => prev.filter((item) => item.id !== id));
	}

	async function handleAssetAssign(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const created = await apiFetch<{ data: { id: number; asset_name: string | null; asset_tag: string | null; status: string; assigned_at: string; returned_at: string | null } }>("/asset-assignments", {
			method: "POST",
			body: JSON.stringify({ employee_id: Number(employeeId), asset_id: Number(assetId) }),
		});

		setAssignments((prev) => [created.data, ...prev]);
		setAssets((prev) => prev.filter((asset) => String(asset.id) !== assetId));
		setAssetId("");
	}

	async function handleReturnAssignment(id: number) {
		const updated = await apiFetch<{ data: { id: number; asset_name: string | null; asset_tag: string | null; status: string; assigned_at: string; returned_at: string | null } }>(`/asset-assignments/${id}/return`, {
			method: "PATCH",
		});

		setAssignments((prev) => prev.map((assignment) => assignment.id === id ? updated.data : assignment));
	}

	async function handleAssignmentDelete(id: number) {
		if (!confirm("Weet u zeker dat u deze asset-toewijzing wilt verwijderen?")) {
			return;
		}

		await apiFetch<{ message: string }>(`/asset-assignments/${id}`, { method: "DELETE" });
		setAssignments((prev) => prev.filter((item) => item.id !== id));
	}

	async function handleSalaryCreate(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const created = await apiFetch<{ data: { id: number; amount: string; currency: string; start_date: string; end_date: string | null; status: string } }>("/salary-assignments", {
			method: "POST",
			body: JSON.stringify({
				employee_id: Number(employeeId),
				amount: Number(salaryAmount),
				currency: salaryCurrency,
				start_date: salaryStartDate,
				status: "active",
			}),
		});

		setSalaryAssignments((prev) => [created.data, ...prev]);
		setSalaryAmount("");
		setSalaryCurrency("SRD");
		setSalaryStartDate("");
	}

	async function handleSalaryDelete(id: number) {
		if (!confirm("Weet u zeker dat u deze salaristoewijzing wilt verwijderen?")) {
			return;
		}

		await apiFetch<{ message: string }>(`/salary-assignments/${id}`, { method: "DELETE" });
		setSalaryAssignments((prev) => prev.filter((item) => item.id !== id));
	}

	async function handleQualificationCreate(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setQualificationError(null);

		if (!qualificationName.trim()) {
			setQualificationError("Naam van kwalificatie is verplicht.");
			return;
		}

		if (!canCreateQualifications && !canUpdateQualifications) {
			setQualificationError("U heeft geen rechten om kwalificaties te beheren.");
			return;
		}

		try {
			if (editingQualificationId) {
				const updated = await apiFetch<{ data: Qualification }>(`/qualifications/${editingQualificationId}`, {
					method: "PATCH",
					body: JSON.stringify({
						name: qualificationName,
						institution: qualificationInstitution || null,
						obtained_date: qualificationObtainedDate || null,
						status: qualificationStatus,
					}),
				});

				setQualifications((prev) => prev.map((item) => item.id === editingQualificationId ? updated.data : item));
			} else {
				const created = await apiFetch<{ data: Qualification }>("/qualifications", {
					method: "POST",
					body: JSON.stringify({
						employee_id: Number(employeeId),
						name: qualificationName,
						institution: qualificationInstitution || null,
						obtained_date: qualificationObtainedDate || null,
						status: qualificationStatus,
					}),
				});

				setQualifications((prev) => [created.data, ...prev]);
			}

			setQualificationName("");
			setQualificationInstitution("");
			setQualificationObtainedDate("");
			setQualificationStatus("valid");
			setEditingQualificationId(null);
		} catch (err) {
			setQualificationError(getErrorMessage(err, "Kwalificatie kon niet worden opgeslagen."));
		}
	}

	async function handleQualificationDelete(id: number) {
		if (!confirm("Weet u zeker dat u deze kwalificatie wilt verwijderen?")) {
			return;
		}

		await apiFetch<{ message: string }>(`/qualifications/${id}`, { method: "DELETE" });
		setQualifications((prev) => prev.filter((item) => item.id !== id));
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

	async function handleWorkExperienceCreate(event: FormEvent<HTMLFormElement>) {
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

		if (!canCreateWorkExperiences && !canUpdateWorkExperiences) {
			setWorkExperienceError("U heeft geen rechten om werkervaring te beheren.");
			return;
		}

		try {
			if (editingWorkExperienceId) {
				const updated = await apiFetch<{ data: WorkExperience }>(`/work-experiences/${editingWorkExperienceId}`, {
					method: "PATCH",
					body: JSON.stringify({
						company_name: experienceCompanyName,
						job_title: experienceJobTitle,
						start_date: experienceStartDate,
						end_date: experienceEndDate || null,
					}),
				});

				setWorkExperiences((prev) => prev.map((item) => item.id === editingWorkExperienceId ? updated.data : item));
			} else {
				const created = await apiFetch<{ data: WorkExperience }>("/work-experiences", {
					method: "POST",
					body: JSON.stringify({
						employee_id: Number(employeeId),
						company_name: experienceCompanyName,
						job_title: experienceJobTitle,
						start_date: experienceStartDate,
						end_date: experienceEndDate || null,
					}),
				});

				setWorkExperiences((prev) => [created.data, ...prev]);
			}

			setExperienceCompanyName("");
			setExperienceJobTitle("");
			setExperienceStartDate("");
			setExperienceEndDate("");
			setEditingWorkExperienceId(null);
		} catch (err) {
			setWorkExperienceError(getErrorMessage(err, "Werkervaring kon niet worden opgeslagen."));
		}
	}

	async function handleWorkExperienceDelete(id: number) {
		if (!confirm("Weet u zeker dat u deze werkervaring wilt verwijderen?")) {
			return;
		}

		await apiFetch<{ message: string }>(`/work-experiences/${id}`, { method: "DELETE" });
		setWorkExperiences((prev) => prev.filter((item) => item.id !== id));
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

	if (loading) {
		return <main style={{ padding: "1.5rem" }}><p>Laden...</p></main>;
	}

	if (forbidden) {
		return <main style={{ padding: "1.5rem" }}><p>Je hebt geen rechten om medewerkers te bekijken.</p></main>;
	}

	const filteredDepartments = directorateId
		? departments.filter((department) => String(department.directorate_id ?? "") === directorateId)
		: departments;

	const filteredPositions = positions.filter((position) => {
		if (directorateId && String(position.directorate_id ?? "") !== directorateId) {
			return false;
		}

		if (departmentId && String(position.department_id ?? "") !== departmentId) {
			return false;
		}

		if (jobFunctionId && String(position.job_function_id ?? "") !== jobFunctionId) {
			return false;
		}

		return true;
	});

	function getEmploymentTypeLabel(type: string) {
		switch (type) {
			case "permanent":
				return "Vaste dienst";
			case "contract":
				return "Overeenkomst";
			case "temporary":
				return "Tijdelijke dienst";
			default:
				return type;
		}
	}

	function getEmployeeStatusLabel(status: string) {
		switch (status) {
			case "active":
				return "Actief";
			case "inactive":
				return "Inactief";
			case "on_leave":
				return "Met verlof";
			case "suspended":
				return "Geschorst";
			case "exited":
				return "Uit dienst";
			default:
				return status;
		}
	}

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
			title="Medewerkerdetails"
			subtitle={employee ? `${employee.employee_number} - ${employee.first_name} ${employee.last_name} (${getEmployeeStatusLabel(employee.status)})` : ""}
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
					<div className="list-row" style={{ alignItems: "center" }}>
						<div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
							{employee.profile_photo_url ? (
								<Image
									src={employee.profile_photo_url}
									alt="Medewerker"
									width={64}
									height={64}
									unoptimized
									style={{ borderRadius: "50%", objectFit: "cover" }}
								/>
							) : (
								<div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#e5e7eb", display: "grid", placeItems: "center" }}>Geen foto</div>
							)}
							<div>
								<div><strong>Huidige afdeling:</strong> {records.find((r) => r.status === "active")?.department_name ?? "Niet gekoppeld"}</div>
								<div className="muted"><strong>Directoraat:</strong> {records.find((r) => r.status === "active")?.directorate_name ?? "-"}</div>
							</div>
						</div>
					</div>

					{canManageEmployment ? (
						<>
							<h2 style={{ marginTop: 0 }}>Profiel bewerken</h2>
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
								onSubmit={handleEmployeeUpdate}
								submitLabel={savingEmployee ? "Opslaan..." : "Medewerker opslaan"}
							/>
							{canDeleteEmployee && <button className="btn secondary" type="button" onClick={() => void handleEmployeeDelete()}>Medewerker verwijderen</button>}
						</>
					) : (
						<p className="muted">Je hebt alleen leesrechten voor profielgegevens.</p>
					)}
				</section>
			)}

			{activeTab === "employment" && (
				<section className="grid">
					<h2 style={{ marginTop: 0 }}>Werkgegevens en dienstverbanden</h2>
					{canManageEmployment && (
						<form onSubmit={handleEmploymentCreate} className="filter-row">
							<select
								value={directorateId}
								onChange={(event) => {
									setDirectorateId(event.target.value);
									setDepartmentId("");
									setPositionId("");
								}}
							>
								<option value="">Selecteer directoraat</option>
								{directorates.map((directorate) => <option key={directorate.id} value={directorate.id}>{directorate.name}</option>)}
							</select>
							<select
								value={departmentId}
								onChange={(event) => {
									setDepartmentId(event.target.value);
									setPositionId("");
								}}
							>
								<option value="">Selecteer afdeling</option>
								{filteredDepartments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
							</select>
							<select
								value={jobFunctionId}
								onChange={(event) => {
									setJobFunctionId(event.target.value);
									setPositionId("");
								}}
							>
								<option value="">Selecteer functie</option>
								{jobFunctions.map((jobFunction) => <option key={jobFunction.id} value={jobFunction.id}>{jobFunction.title}</option>)}
							</select>
							<select value={positionId} onChange={(event) => setPositionId(event.target.value)}>
								<option value="">Selecteer werkpositie</option>
								{filteredPositions.map((position) => <option key={position.id} value={position.id}>{position.title}{position.department_name ? ` - ${position.department_name}` : ""}</option>)}
							</select>
							<input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required />
							<select value={employmentType} onChange={(event) => setEmploymentType(event.target.value)}>
								<option value="permanent">Vaste dienst</option>
								<option value="contract">Overeenkomst</option>
								<option value="temporary">Tijdelijke dienst</option>
							</select>
							<button className="btn" type="submit">Dienstverband toevoegen</button>
						</form>
					)}
					<div className="list-grid">
						{records.map((item) => (
							<div key={item.id} className="list-row">
								<div>
									<strong>{item.position_title ?? "Geen werkpositie"}</strong>
									{item.department_name ? ` - ${item.department_name}` : ""}
									{item.directorate_name ? ` (${item.directorate_name})` : ""}
									{item.job_function_title ? ` - Functie: ${item.job_function_title}` : ""}
									{` - ${getEmploymentTypeLabel(item.employment_type)} - ${item.start_date}`}
								</div>
								<div className="list-row-actions">
									{canManageEmployment && <button className="btn secondary" type="button" onClick={() => void handleEmploymentDelete(item.id)}>Verwijderen</button>}
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
							<button className="btn" type="submit">Document uploaden</button>
						</form>
					)}
					<div className="list-grid">
						{documents.map((item) => (
							<div key={item.id} className="list-row">
								<div>{item.title} - {item.document_type} - {item.original_name}</div>
								<div className="list-row-actions">
									{canDeleteDocuments && <button className="btn secondary" type="button" onClick={() => void handleDocumentDelete(item.id)}>Verwijderen</button>}
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
							<button className="btn" type="submit">{editingQualificationId ? "Kwalificatie opslaan" : "Kwalificatie toevoegen"}</button>
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
									{canDeleteQualifications && <button className="btn secondary" type="button" onClick={() => void handleQualificationDelete(item.id)}>Verwijderen</button>}
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
							<button className="btn" type="submit">{editingWorkExperienceId ? "Werkervaring opslaan" : "Werkervaring toevoegen"}</button>
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
									{canDeleteWorkExperiences && <button className="btn secondary" type="button" onClick={() => void handleWorkExperienceDelete(item.id)}>Verwijderen</button>}
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
						<form onSubmit={handleSalaryCreate} className="filter-row">
							<input type="number" min="0" step="0.01" value={salaryAmount} onChange={(event) => setSalaryAmount(event.target.value)} placeholder="Salarisbedrag" required />
							<select value={salaryCurrency} onChange={(event) => setSalaryCurrency(event.target.value)}>
								<option value="SRD">SRD</option>
								<option value="USD">USD</option>
								<option value="EUR">EUR</option>
							</select>
							<input type="date" value={salaryStartDate} onChange={(event) => setSalaryStartDate(event.target.value)} required />
							<button className="btn" type="submit">Salaris toevoegen</button>
						</form>
					)}
					<div className="list-grid">
						{salaryAssignments.map((item) => (
							<div key={item.id} className="list-row">
								<div>{item.amount} {item.currency} - {item.start_date} - {item.status}</div>
								<div className="list-row-actions">
									{canDeleteSalary && <button className="btn secondary" type="button" onClick={() => void handleSalaryDelete(item.id)}>Verwijderen</button>}
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
						<form onSubmit={handleAssetAssign} className="filter-row">
							<select value={assetId} onChange={(event) => setAssetId(event.target.value)} required>
								<option value="">Selecteer asset</option>
								{assets.map((asset) => <option key={asset.id} value={asset.id}>{asset.asset_tag} - {asset.name}</option>)}
							</select>
							<button className="btn" type="submit">Asset toewijzen</button>
						</form>
					)}
					<div className="list-grid">
						{assignments.map((item) => (
							<div key={item.id} className="list-row">
								<div>{item.asset_tag ?? "-"} - {item.asset_name ?? "Onbekende asset"} - {item.status}</div>
								<div className="list-row-actions">
									{canReturnAssets && item.status === "assigned" && <button className="btn secondary" type="button" onClick={() => void handleReturnAssignment(item.id)}>Terugnemen</button>}
									{canReturnAssets && <button className="btn secondary" type="button" onClick={() => void handleAssignmentDelete(item.id)}>Verwijderen</button>}
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
								<div>Dienstverband bijgewerkt: {item.position_title ?? "Geen werkpositie"} ({item.start_date})</div>
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

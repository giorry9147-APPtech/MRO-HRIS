"use client";

import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuthGuard";
import EmployeeForm, { EmployeeFormValues } from "@/components/employee/EmployeeForm";

export default function NewEmployeePage() {
	const router = useRouter();
	const { loading, forbidden } = useAuthGuard("employees.create");

	async function handleCreate(values: EmployeeFormValues) {
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

		router.push(`/employees/${response.data.id}`);
	}

	if (loading) {
		return <main style={{ padding: "1.5rem" }}><p>Laden...</p></main>;
	}

	if (forbidden) {
		return <main style={{ padding: "1.5rem" }}><p>Je hebt geen rechten om medewerkers aan te maken.</p></main>;
	}

	return (
		<main style={{ padding: "1.5rem" }}>
			<h1>New Employee</h1>
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
				submitLabel="Create employee"
			/>
		</main>
	);
}

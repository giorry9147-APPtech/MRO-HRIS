"use client";

import { FormEvent, useEffect, useState } from "react";

export type EmployeeFormValues = {
	employee_number: string;
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	address: string;
	profile_photo: File | null;
	date_joined: string;
	status: string;
};

type EmployeeFormProps = {
	initialValues: EmployeeFormValues;
	onSubmit: (values: EmployeeFormValues) => Promise<void>;
	submitLabel: string;
};

export default function EmployeeForm({ initialValues, onSubmit, submitLabel }: EmployeeFormProps) {
	const [values, setValues] = useState<EmployeeFormValues>(initialValues);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setValues(initialValues);
	}, [initialValues]);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSubmitting(true);
		setError(null);

		try {
			await onSubmit(values);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Opslaan mislukt.");
		} finally {
			setSubmitting(false);
		}
	}

	function setField<K extends keyof EmployeeFormValues>(field: K, value: EmployeeFormValues[K]) {
		setValues((current) => ({ ...current, [field]: value }));
	}

	return (
		<form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem", maxWidth: "520px" }}>
			<input value={values.employee_number} onChange={(event) => setField("employee_number", event.target.value)} placeholder="Personeelsnummer" required />
			<input value={values.first_name} onChange={(event) => setField("first_name", event.target.value)} placeholder="Voornaam" required />
			<input value={values.last_name} onChange={(event) => setField("last_name", event.target.value)} placeholder="Achternaam" required />
			<input value={values.email} onChange={(event) => setField("email", event.target.value)} placeholder="E-mailadres" type="email" />
			<input value={values.phone} onChange={(event) => setField("phone", event.target.value)} placeholder="Telefoon" />
			<textarea value={values.address} onChange={(event) => setField("address", event.target.value)} placeholder="Adres" rows={3} />
			<label htmlFor="profile-photo-input">Pasfoto</label>
			<input id="profile-photo-input" type="file" aria-label="Pasfoto uploaden" title="Pasfoto uploaden" accept="image/png,image/jpeg,image/webp" onChange={(event) => setField("profile_photo", event.target.files?.[0] ?? null)} />
			<input value={values.date_joined} onChange={(event) => setField("date_joined", event.target.value)} type="date" />
			<select value={values.status} onChange={(event) => setField("status", event.target.value)}>
				<option value="active">Actief</option>
				<option value="inactive">Inactief</option>
				<option value="on_leave">Met verlof</option>
				<option value="suspended">Geschorst</option>
				<option value="exited">Uit dienst</option>
			</select>
			<button type="submit" disabled={submitting}>{submitting ? "Bezig..." : submitLabel}</button>
			{error && <p style={{ color: "crimson" }}>{error}</p>}
		</form>
	);
}
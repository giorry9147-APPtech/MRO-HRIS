"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

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
	existingPhotoUrl?: string | null;
	displayName?: string;
	statusLabel?: string;
	statusClass?: string;
	departmentName?: string | null;
	directorateName?: string | null;
	jobFunctionTitle?: string | null;
	employmentSummary?: string | null;
	onSubmit: (values: EmployeeFormValues) => Promise<void>;
	submitLabel: string;
};

export default function EmployeeForm({
	initialValues,
	existingPhotoUrl,
	displayName,
	statusLabel,
	statusClass,
	departmentName,
	directorateName,
	jobFunctionTitle,
	employmentSummary,
	onSubmit,
	submitLabel,
}: EmployeeFormProps) {
	const [values, setValues] = useState<EmployeeFormValues>(initialValues);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [photoPreview, setPhotoPreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setValues(initialValues);
		setPhotoPreview(null);
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

	function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0] ?? null;
		setField("profile_photo", file);
		if (file) {
			setPhotoPreview(URL.createObjectURL(file));
		} else {
			setPhotoPreview(null);
		}
	}

	const displayPhoto = photoPreview ?? existingPhotoUrl ?? null;

	return (
		<form onSubmit={handleSubmit}>
			{/* Profile header: photo upload + identity summary */}
			<div className="employee-profile-header" style={{ marginBottom: "1.5rem" }}>
				<div style={{ flexShrink: 0 }}>
					<div className="photo-upload-wrap" onClick={() => fileInputRef.current?.click()}>
						{displayPhoto ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img src={displayPhoto} alt="Profielfoto" className="photo-upload-img" />
						) : (
							<div className="photo-upload-placeholder">
								<span className="photo-upload-placeholder-icon">👤</span>
								<span className="photo-upload-placeholder-label">Foto toevoegen</span>
							</div>
						)}
						<div className="photo-upload-overlay">
							<span style={{ fontSize: "1.4rem" }}>📷</span>
							<span style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.04em" }}>Wijzigen</span>
						</div>
					</div>
					<input
						ref={fileInputRef}
						id="profile-photo-input"
						type="file"
						accept="image/png,image/jpeg,image/webp"
						style={{ display: "none" }}
						onChange={handlePhotoChange}
					/>
				</div>

				{displayName && (
					<div style={{ paddingTop: "0.25rem" }}>
						<h2 className="employee-profile-name">{displayName}</h2>
						{statusLabel && (
							<div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.35rem" }}>
								<span className={`employee-status-pill${statusClass ? ` ${statusClass}` : ""}`}>{statusLabel}</span>
							</div>
						)}
						{departmentName && (
							<div className="employee-profile-dept" style={{ marginTop: "0.55rem" }}>
								<span className="employee-profile-dept-label">Afdeling</span>
								{departmentName}
							</div>
						)}
						{directorateName && (
							<div className="employee-profile-dept">
								<span className="employee-profile-dept-label">Directoraat</span>
								{directorateName}
							</div>
						)}
						{jobFunctionTitle && (
							<div className="employee-profile-dept">
								<span className="employee-profile-dept-label">Functie</span>
								{jobFunctionTitle}
							</div>
						)}
						{employmentSummary && (
							<div className="employee-profile-dept">
								<span className="employee-profile-dept-label">Dienstverband</span>
								{employmentSummary}
							</div>
						)}
					</div>
				)}
			</div>

			<div className="module-title-rule" style={{ marginBottom: "1.25rem" }} />

			{/* 2-column fields */}
			<div className="employee-form-fields">
				<div className="form-field">
					<label htmlFor="ef-employee-number">Personeelsnummer</label>
					<input
						id="ef-employee-number"
						value={values.employee_number}
						onChange={(e) => setField("employee_number", e.target.value)}
						required
					/>
				</div>
				<div className="form-field">
					<label htmlFor="ef-date-joined">Datum in dienst</label>
					<input
						id="ef-date-joined"
						type="date"
						value={values.date_joined}
						onChange={(e) => setField("date_joined", e.target.value)}
					/>
				</div>
				<div className="form-field">
					<label htmlFor="ef-first-name">Voornaam</label>
					<input
						id="ef-first-name"
						value={values.first_name}
						onChange={(e) => setField("first_name", e.target.value)}
						required
					/>
				</div>
				<div className="form-field">
					<label htmlFor="ef-last-name">Achternaam</label>
					<input
						id="ef-last-name"
						value={values.last_name}
						onChange={(e) => setField("last_name", e.target.value)}
						required
					/>
				</div>
				<div className="form-field">
					<label htmlFor="ef-email">E-mailadres</label>
					<input
						id="ef-email"
						type="email"
						value={values.email}
						onChange={(e) => setField("email", e.target.value)}
					/>
				</div>
				<div className="form-field">
					<label htmlFor="ef-phone">Telefoon</label>
					<input
						id="ef-phone"
						value={values.phone}
						onChange={(e) => setField("phone", e.target.value)}
					/>
				</div>
				<div className="form-field">
					<label htmlFor="ef-status">Status</label>
					<select
						id="ef-status"
						value={values.status}
						onChange={(e) => setField("status", e.target.value)}
					>
						<option value="active">Actief</option>
						<option value="inactive">Inactief</option>
						<option value="on_leave">Met verlof</option>
						<option value="suspended">Geschorst</option>
						<option value="exited">Uit dienst</option>
					</select>
				</div>
				<div className="form-field field-full">
					<label htmlFor="ef-address">Adres</label>
					<textarea
						id="ef-address"
						value={values.address}
						onChange={(e) => setField("address", e.target.value)}
						rows={3}
					/>
				</div>
			</div>

			<div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginTop: "1.25rem" }}>
				<button type="submit" disabled={submitting}>
					{submitting ? "Bezig..." : submitLabel}
				</button>
				{error && <p style={{ margin: 0, color: "crimson", fontSize: "0.875rem" }}>{error}</p>}
			</div>
		</form>
	);
}

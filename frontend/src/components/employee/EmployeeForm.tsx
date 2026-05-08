"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema, type EmployeeValues } from "@/lib/schemas";

export type EmployeeFormValues = EmployeeValues;

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
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [photoPreview, setPhotoPreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<EmployeeFormValues>({
		resolver: zodResolver(employeeSchema),
		defaultValues: initialValues,
	});

	useEffect(() => {
		reset(initialValues);
		setPhotoPreview(null);
	}, [initialValues, reset]);

	const submit = handleSubmit(async (values) => {
		setSubmitError(null);
		try {
			await onSubmit(values);
		} catch (err) {
			setSubmitError(err instanceof Error ? err.message : "Opslaan mislukt.");
		}
	});

	function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0] ?? null;
		setValue("profile_photo", file, { shouldValidate: true });
		setPhotoPreview(file ? URL.createObjectURL(file) : null);
	}

	const displayPhoto = photoPreview ?? existingPhotoUrl ?? null;

	return (
		<form onSubmit={submit} noValidate>
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
					{errors.profile_photo && (
						<p style={{ color: "var(--danger)", fontSize: "0.75rem", marginTop: "0.4rem", textAlign: "center" }}>
							{errors.profile_photo.message as string}
						</p>
					)}
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

			<div className="employee-form-fields">
				<Field label="Personeelsnummer" htmlFor="ef-employee-number" error={errors.employee_number?.message}>
					<input id="ef-employee-number" {...register("employee_number")} />
				</Field>

				<Field label="Datum in dienst" htmlFor="ef-date-joined" error={errors.date_joined?.message}>
					<input id="ef-date-joined" type="date" {...register("date_joined")} />
				</Field>

				<Field label="Voornaam" htmlFor="ef-first-name" error={errors.first_name?.message}>
					<input id="ef-first-name" {...register("first_name")} />
				</Field>

				<Field label="Achternaam" htmlFor="ef-last-name" error={errors.last_name?.message}>
					<input id="ef-last-name" {...register("last_name")} />
				</Field>

				<Field label="E-mailadres" htmlFor="ef-email" error={errors.email?.message}>
					<input id="ef-email" type="email" {...register("email")} />
				</Field>

				<Field label="Telefoon" htmlFor="ef-phone" error={errors.phone?.message}>
					<input id="ef-phone" {...register("phone")} />
				</Field>

				<Field label="Status" htmlFor="ef-status" error={errors.status?.message}>
					<select id="ef-status" {...register("status")}>
						<option value="active">Actief</option>
						<option value="inactive">Inactief</option>
						<option value="on_leave">Met verlof</option>
						<option value="suspended">Geschorst</option>
						<option value="exited">Uit dienst</option>
					</select>
				</Field>

				<div className="form-field field-full">
					<label htmlFor="ef-address">Adres</label>
					<textarea id="ef-address" rows={3} {...register("address")} />
					{errors.address && <span style={{ color: "var(--danger)", fontSize: "0.78rem" }}>{errors.address.message}</span>}
				</div>
			</div>

			<div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginTop: "1.25rem" }}>
				<button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Bezig..." : submitLabel}
				</button>
				{submitError && <p style={{ margin: 0, color: "crimson", fontSize: "0.875rem" }}>{submitError}</p>}
			</div>
		</form>
	);
}

type FieldProps = {
	label: string;
	htmlFor: string;
	error?: string;
	children: React.ReactNode;
};

function Field({ label, htmlFor, error, children }: FieldProps) {
	return (
		<div className="form-field">
			<label htmlFor={htmlFor}>{label}</label>
			{children}
			{error && <span style={{ color: "var(--danger)", fontSize: "0.78rem" }}>{error}</span>}
		</div>
	);
}

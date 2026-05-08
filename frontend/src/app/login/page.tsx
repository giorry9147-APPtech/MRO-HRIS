"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/lib/auth";
import { loginSchema, type LoginValues } from "@/lib/schemas";

export default function LoginPage() {
	const router = useRouter();
	const [submitError, setSubmitError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "admin@mro-hris.local",
			password: "Admin12345",
		},
	});

	const onSubmit = handleSubmit(async (values) => {
		setSubmitError(null);
		try {
			await login(values.email, values.password);
			router.push("/dashboard");
		} catch (err) {
			setSubmitError(err instanceof Error ? err.message : "Inloggen mislukt.");
		}
	});

	return (
		<div style={{
			minHeight: "100vh",
			width: "100vw",
			display: "grid",
			gridTemplateColumns: "1fr 1fr",
			background: "var(--bg)",
		}}>
			{/* Left brand panel */}
			<div style={{
				background: "linear-gradient(160deg, #0f766e 0%, #0b534d 60%, #083d39 100%)",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				padding: "3rem",
				position: "relative",
				overflow: "hidden",
			}}>
				<div style={{
					position: "absolute",
					top: "-80px",
					right: "-80px",
					width: "320px",
					height: "320px",
					borderRadius: "50%",
					background: "rgba(255,255,255,0.05)",
					pointerEvents: "none",
				}} />
				<div style={{
					position: "absolute",
					bottom: "60px",
					left: "-60px",
					width: "240px",
					height: "240px",
					borderRadius: "50%",
					background: "rgba(255,255,255,0.04)",
					pointerEvents: "none",
				}} />

				<div>
					<div style={{
						display: "inline-flex",
						alignItems: "center",
						gap: "0.6rem",
						background: "rgba(255,255,255,0.12)",
						borderRadius: "12px",
						padding: "0.5rem 0.9rem",
					}}>
						<span style={{ fontSize: "1.4rem" }}>✦</span>
						<span style={{ color: "#fff", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.02em" }}>MRO · HRIS</span>
					</div>
				</div>

				<div>
					<h2 style={{
						color: "#fff",
						fontSize: "1.7rem",
						fontWeight: 700,
						lineHeight: 1.25,
						margin: "0 0 1rem",
					}}>
						Ministerie Regionale Ontwikkeling<br />
						<span style={{ color: "rgba(255,255,255,0.75)", fontWeight: 400, fontSize: "1.1rem" }}>
							Human Resource Information System
						</span>
					</h2>
					<p style={{
						color: "rgba(255,255,255,0.65)",
						fontSize: "0.95rem",
						margin: 0,
						lineHeight: 1.6,
						maxWidth: "340px",
					}}>
						Beheer medewerkers, dienstverbanden, documenten en meer — op één centrale plek.
					</p>

					<div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "2rem" }}>
						{["Medewerkersbeheer", "Werkgegevens", "Documenten", "Salaris"].map((label) => (
							<span key={label} style={{
								background: "rgba(255,255,255,0.1)",
								border: "1px solid rgba(255,255,255,0.15)",
								borderRadius: "20px",
								padding: "0.3rem 0.8rem",
								color: "rgba(255,255,255,0.8)",
								fontSize: "0.8rem",
								fontWeight: 500,
							}}>
								{label}
							</span>
						))}
					</div>
				</div>

				<p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem", margin: 0 }}>
					© {new Date().getFullYear()} MRO · Alle rechten voorbehouden
				</p>
			</div>

			{/* Right form panel */}
			<div style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				padding: "3rem 2rem",
			}}>
				<div style={{ width: "100%", maxWidth: "400px" }}>
					<div style={{ marginBottom: "2.5rem" }}>
						<h1 style={{
							margin: "0 0 0.4rem",
							fontSize: "1.75rem",
							fontWeight: 700,
							color: "var(--ink)",
						}}>
							Welkom terug
						</h1>
						<p style={{ margin: 0, color: "var(--muted)", fontSize: "0.93rem" }}>
							Log in om verder te gaan naar het dashboard.
						</p>
					</div>

					<form onSubmit={onSubmit} style={{ display: "grid", gap: "1.1rem" }} noValidate>
						<div style={{ display: "grid", gap: "0.4rem" }}>
							<label htmlFor="email" style={{
								fontSize: "0.85rem",
								fontWeight: 600,
								color: "var(--ink)",
							}}>
								E-mailadres
							</label>
							<input
								id="email"
								type="email"
								placeholder="jouw@email.com"
								aria-invalid={errors.email ? "true" : "false"}
								{...register("email")}
								style={{
									padding: "0.75rem 1rem",
									borderRadius: "12px",
									border: `1.5px solid ${errors.email ? "var(--danger)" : "var(--line)"}`,
									fontSize: "0.95rem",
									background: "var(--surface)",
									transition: "border-color 0.15s",
								}}
							/>
							{errors.email && (
								<span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>
									{errors.email.message}
								</span>
							)}
						</div>

						<div style={{ display: "grid", gap: "0.4rem" }}>
							<label htmlFor="password" style={{
								fontSize: "0.85rem",
								fontWeight: 600,
								color: "var(--ink)",
							}}>
								Wachtwoord
							</label>
							<input
								id="password"
								type="password"
								placeholder="••••••••"
								aria-invalid={errors.password ? "true" : "false"}
								{...register("password")}
								style={{
									padding: "0.75rem 1rem",
									borderRadius: "12px",
									border: `1.5px solid ${errors.password ? "var(--danger)" : "var(--line)"}`,
									fontSize: "0.95rem",
									background: "var(--surface)",
									transition: "border-color 0.15s",
								}}
							/>
							{errors.password && (
								<span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>
									{errors.password.message}
								</span>
							)}
						</div>

						{submitError && (
							<div style={{
								background: "#fef2f2",
								border: "1px solid #fecaca",
								borderRadius: "10px",
								padding: "0.75rem 1rem",
								color: "var(--danger)",
								fontSize: "0.88rem",
								fontWeight: 500,
							}}>
								{submitError}
							</div>
						)}

						<button
							className="btn"
							type="submit"
							disabled={isSubmitting}
							style={{
								width: "100%",
								padding: "0.85rem",
								fontSize: "0.97rem",
								borderRadius: "12px",
								marginTop: "0.25rem",
							}}
						>
							{isSubmitting ? "Bezig met inloggen..." : "Inloggen"}
						</button>
					</form>

					<p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.85rem", color: "var(--muted)" }}>
						<Link href="/" style={{ color: "var(--brand)", fontWeight: 600 }}>
							← Terug naar start
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

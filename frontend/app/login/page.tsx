"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("admin@mro-hris.local");
	const [password, setPassword] = useState("Admin12345");
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setIsSubmitting(true);
		try {
			await login(email, password);
			router.push("/dashboard");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Inloggen mislukt.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div style={{
			minHeight: "100vh",
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
				{/* Decorative circles */}
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

				{/* Logo */}
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
						<span style={{ color: "#fff", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.02em" }}>MRO-HRIS</span>
					</div>
				</div>

				{/* Center copy */}
				<div>
					<h2 style={{
						color: "#fff",
						fontSize: "2rem",
						fontWeight: 700,
						lineHeight: 1.2,
						margin: "0 0 1rem",
					}}>
						Human Resource<br />Informatie Systeem
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

					{/* Feature pills */}
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

				{/* Footer */}
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
					{/* Header */}
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

					{/* Form */}
					<form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.1rem" }}>
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
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="jouw@email.com"
								required
								style={{
									padding: "0.75rem 1rem",
									borderRadius: "12px",
									border: "1.5px solid var(--line)",
									fontSize: "0.95rem",
									background: "var(--surface)",
									transition: "border-color 0.15s",
								}}
							/>
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
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								required
								style={{
									padding: "0.75rem 1rem",
									borderRadius: "12px",
									border: "1.5px solid var(--line)",
									fontSize: "0.95rem",
									background: "var(--surface)",
									transition: "border-color 0.15s",
								}}
							/>
						</div>

						{error && (
							<div style={{
								background: "#fef2f2",
								border: "1px solid #fecaca",
								borderRadius: "10px",
								padding: "0.75rem 1rem",
								color: "var(--danger)",
								fontSize: "0.88rem",
								fontWeight: 500,
							}}>
								{error}
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

					{/* Back link */}
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

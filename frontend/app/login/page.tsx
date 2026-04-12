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
		<main className="grid" style={{ gap: "1rem", maxWidth: 520, margin: "0 auto" }}>
			<section className="card">
				<p className="muted" style={{ marginTop: 0 }}>Toegang MRO-HRIS</p>
				<h1 style={{ marginTop: 0 }}>Inloggen</h1>
				<p className="muted">Gebruik je account om toegang te krijgen tot het HRIS.</p>

				<form onSubmit={handleSubmit} className="grid" style={{ gap: "0.75rem" }}>
					<label htmlFor="email">E-mail</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						required
					/>

					<label htmlFor="password">Wachtwoord</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						required
					/>

					<button className="btn" type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Bezig..." : "Inloggen"}
					</button>
				</form>

				{error && <p className="error">{error}</p>}
				<p className="muted" style={{ marginBottom: 0 }}>Tip: admin@mro-hris.local / Admin12345</p>
			</section>
			<p className="muted" style={{ margin: 0 }}>
				<Link href="/">Terug naar start</Link>
			</p>
		</main>
	);
}

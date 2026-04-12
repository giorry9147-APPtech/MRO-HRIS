import Link from "next/link";

export default function Page() {
	return (
		<main className="grid" style={{ gap: "1rem" }}>
			<section className="hero">
				<div className="card">
					<p className="muted" style={{ marginTop: 0 }}>MRO-HRIS</p>
					<h1 style={{ marginTop: 0 }}>Een centraal platform voor al je HR-processen</h1>
					<p className="muted">
						Beheer medewerkers, dossiers, salarissen, documenten, bedrijfsmiddelen en rapportage vanuit een beveiligd platform.
					</p>
					<div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
						<Link className="btn link" href="/login">Ga naar inloggen</Link>
						<Link className="btn secondary link" href="/dashboard">Open dashboard</Link>
					</div>
				</div>

				<div className="card" style={{ background: "#f1fbfa" }}>
					<h2 style={{ marginTop: 0 }}>Snel starten</h2>
					<ol style={{ margin: 0, paddingLeft: "1.1rem" }}>
						<li>Log in met je account</li>
						<li>Open dashboard en kies een module</li>
						<li>Maak medewerkers aan of werk ze bij</li>
						<li>Volg documenten, salaris en bedrijfsmiddelen</li>
					</ol>
				</div>
			</section>

			<section className="card">
				<h2 style={{ marginTop: 0 }}>Beschikbare modules</h2>
				<div className="section-links">
					<Link className="section-link" href="/employees">Medewerkers</Link>
					<Link className="section-link" href="/functions">Functies</Link>
					<Link className="section-link" href="/positions">Werkposities</Link>
					<Link className="section-link" href="/departments">Afdelingen</Link>
					<Link className="section-link" href="/directorates">Directoraten</Link>
					<Link className="section-link" href="/documents">Documenten</Link>
					<Link className="section-link" href="/assets">Bedrijfsmiddelen</Link>
					<Link className="section-link" href="/reports">Rapporten</Link>
					<Link className="section-link" href="/login">Authenticatie</Link>
				</div>
			</section>
		</main>
	);
}

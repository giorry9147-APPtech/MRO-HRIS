import Link from "next/link";

export default function Page() {
	return (
		<main className="grid" style={{ gap: "1rem" }}>
			<section className="hero">
				<div className="card">
					<p className="muted" style={{ marginTop: 0 }}>MRO-HRIS</p>
					<h1 style={{ marginTop: 0 }}>One place for your HR operations</h1>
					<p className="muted">
						Manage employees, records, salaries, documents, assets, and reporting from one secured platform.
					</p>
					<div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
						<Link className="btn link" href="/login">Go To Login</Link>
						<Link className="btn secondary link" href="/dashboard">Open Dashboard</Link>
					</div>
				</div>

				<div className="card" style={{ background: "#f1fbfa" }}>
					<h2 style={{ marginTop: 0 }}>Quick Start</h2>
					<ol style={{ margin: 0, paddingLeft: "1.1rem" }}>
						<li>Login with your account</li>
						<li>Open Dashboard and choose a module</li>
						<li>Create/update employee records</li>
						<li>Track documents, salary, and assets</li>
					</ol>
				</div>
			</section>

			<section className="card">
				<h2 style={{ marginTop: 0 }}>Modules Available</h2>
				<div className="section-links">
					<Link className="section-link" href="/employees">Employees</Link>
					<Link className="section-link" href="/functions">Functions</Link>
					<Link className="section-link" href="/positions">Positions</Link>
					<Link className="section-link" href="/departments">Departments</Link>
					<Link className="section-link" href="/directorates">Directorates</Link>
					<Link className="section-link" href="/documents">Documents</Link>
					<Link className="section-link" href="/assets">Assets</Link>
					<Link className="section-link" href="/reports">Reports</Link>
					<Link className="section-link" href="/login">Authentication</Link>
				</div>
			</section>
		</main>
	);
}

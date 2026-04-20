import { ReactNode } from "react";

type ModuleFrameProps = {
	title: string;
	subtitle?: string;
	icon?: string;
	kicker?: string;
	actions?: ReactNode;
	filters?: ReactNode;
	children: ReactNode;
};

export default function ModuleFrame({ title, subtitle, icon, kicker, actions, filters, children }: ModuleFrameProps) {
	return (
		<main className="module-shell">
			<section className="card module-hero-card">
				<div className="module-header">
					{icon && <div className="module-icon">{icon}</div>}
					<div className="module-header-copy">
						{kicker && <p className="module-kicker">{kicker}</p>}
						<h1>{title}</h1>
						<div className="module-title-rule" />
						{subtitle && <p className="muted">{subtitle}</p>}
					</div>
					{actions && <div className="module-actions">{actions}</div>}
				</div>
			</section>
			{filters && <section className="card module-filters">{filters}</section>}
			<section className="card module-content">{children}</section>
		</main>
	);
}

import { ReactNode } from "react";

type ModuleFrameProps = {
	title: string;
	subtitle?: string;
	actions?: ReactNode;
	filters?: ReactNode;
	children: ReactNode;
};

export default function ModuleFrame({ title, subtitle, actions, filters, children }: ModuleFrameProps) {
	return (
		<main className="module-shell">
			<section className="card module-header">
				<div>
					<h1>{title}</h1>
					{subtitle && <p className="muted">{subtitle}</p>}
				</div>
				{actions && <div className="module-actions">{actions}</div>}
			</section>
			{filters && <section className="card module-filters">{filters}</section>}
			<section className="card module-content">{children}</section>
		</main>
	);
}
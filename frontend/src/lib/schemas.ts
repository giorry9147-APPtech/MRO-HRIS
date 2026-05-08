import { z } from "zod";

// Centrale Zod-schema's voor alle MRO-HRIS forms.
// Richtlijn: één schema per resource. Hergebruik tussen create- en edit-pagina's.

export const loginSchema = z.object({
	email: z.string().min(1, "E-mailadres is verplicht").email("Ongeldig e-mailadres"),
	password: z.string().min(1, "Wachtwoord is verplicht"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const employeeStatusSchema = z.enum([
	"active",
	"inactive",
	"on_leave",
	"suspended",
	"exited",
]);

export const employeeSchema = z.object({
	employee_number: z.string().min(1, "Personeelsnummer is verplicht").max(50),
	first_name: z.string().min(1, "Voornaam is verplicht").max(100),
	last_name: z.string().min(1, "Achternaam is verplicht").max(100),
	email: z.string().email("Ongeldig e-mailadres").or(z.literal("")),
	phone: z.string().max(50),
	address: z.string().max(500),
	profile_photo: z
		.instanceof(File)
		.refine((f) => f.size <= 5 * 1024 * 1024, "Maximaal 5MB")
		.refine(
			(f) => ["image/png", "image/jpeg", "image/webp"].includes(f.type),
			"Alleen PNG, JPEG of WEBP",
		)
		.nullable(),
	date_joined: z.string(),
	status: employeeStatusSchema,
});
export type EmployeeValues = z.infer<typeof employeeSchema>;

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Form patroon — react-hook-form + Zod

Alle formulieren in dit project gebruiken **react-hook-form** voor state en **Zod** voor validatie. Geen losse `useState` per veld.

## Schema's
Alle Zod-schema's staan centraal in `src/lib/schemas.ts`. Voeg een nieuw schema toe voor elke nieuwe resource. Hergebruik het type via `z.infer<typeof xxxSchema>`.

## Pattern (kort)
```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mySchema, type MyValues } from "@/lib/schemas";

const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<MyValues>({
  resolver: zodResolver(mySchema),
  defaultValues: { ... },
});

const onSubmit = handleSubmit(async (values) => {
  await api.save(values);
});

<form onSubmit={onSubmit} noValidate>
  <input {...register("name")} aria-invalid={errors.name ? "true" : "false"} />
  {errors.name && <span>{errors.name.message}</span>}
</form>
```

## Voorbeelden
- Eenvoudig: [src/app/login/page.tsx](src/app/login/page.tsx)
- Met file-upload: [src/components/employee/EmployeeForm.tsx](src/components/employee/EmployeeForm.tsx)

## Nog te refactoren (bestaande forms met `useState`)
- `src/app/employees/new/page.tsx` (gebruikt al `EmployeeForm` — geen refactor nodig)
- `src/app/employees/[id]/page.tsx` (zelfde)
- `src/app/departments/page.tsx`
- `src/app/directorates/page.tsx`
- `src/app/functions/page.tsx`
- `src/app/positions/page.tsx`
- `src/app/admin/users/page.tsx`
- `src/app/documents/page.tsx`
- `src/app/assets/page.tsx`

Bij refactor: voeg een schema toe aan `schemas.ts`, vervang `useState`-per-veld door één `useForm` met `zodResolver`, render foutmeldingen onder elk veld via `errors.<field>?.message`.

# Database Schema

## Hoofdtabellen

- users
- roles
- permissions
- directorates
- departments
- locations
- job_functions
- positions
- employees
- employment_records
- qualifications
- work_experiences
- employee_documents
- pay_scales
- salary_assignments
- assets
- asset_assignments
- audit_logs

## Belangrijke relaties

- Employee -> EmploymentRecords
- Employee -> Documents
- Employee -> SalaryAssignments
- Employee -> Assets

- Department -> Positions
- Position -> Employee

## Belangrijke regels

- Gebruik foreign keys
- Gebruik historie (geen overschrijven)
- Gebruik enums voor status

## Status velden

Employee:
- active
- inactive
- on_leave
- suspended
- exited

Position:
- vacant
- occupied
- frozen
- abolished

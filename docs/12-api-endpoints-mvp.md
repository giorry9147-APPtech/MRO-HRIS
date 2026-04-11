# API Endpoints (MVP)

## Auth

- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

## Organisatie

### Directorates
- GET /api/directorates
- POST /api/directorates
- GET /api/directorates/{id}
- PUT /api/directorates/{id}
- DELETE /api/directorates/{id}

### Departments
- GET /api/departments
- POST /api/departments
- GET /api/departments/{id}
- PUT /api/departments/{id}
- DELETE /api/departments/{id}

## Functies

- GET /api/job-functions
- POST /api/job-functions
- GET /api/job-functions/{id}
- PUT /api/job-functions/{id}
- DELETE /api/job-functions/{id}

## Posities

- GET /api/positions
- POST /api/positions
- GET /api/positions/{id}
- PUT /api/positions/{id}
- DELETE /api/positions/{id}

## Medewerkers

- GET /api/employees
- POST /api/employees
- GET /api/employees/{id}
- PUT /api/employees/{id}
- DELETE /api/employees/{id}

Filters:
- department_id
- directorate_id
- status
- location

## Dienstverband

- POST /api/employment-records
- GET /api/employment-records/{employee_id}
- PUT /api/employment-records/{id}

## Documenten

- POST /api/documents/upload
- GET /api/documents/{employee_id}
- DELETE /api/documents/{id}
- GET /api/documents/download/{id}

## Kwalificaties

- POST /api/qualifications
- GET /api/qualifications/{employee_id}
- PUT /api/qualifications/{id}
- DELETE /api/qualifications/{id}

## Salaris

- POST /api/salary-assignments
- GET /api/salary-assignments/{employee_id}
- PUT /api/salary-assignments/{id}

## Assets

### Assets
- GET /api/assets
- POST /api/assets
- PUT /api/assets/{id}
- DELETE /api/assets/{id}

### Asset Assignments
- POST /api/asset-assignments
- PUT /api/asset-assignments/{id}/return
- GET /api/asset-assignments/{employee_id}

## Rapporten

- GET /api/reports/headcount
- GET /api/reports/by-department
- GET /api/reports/by-pay-scale
- GET /api/reports/assets
- GET /api/reports/incomplete-dossiers

## Settings (later)

- GET /api/settings/document-types
- GET /api/settings/asset-types
- GET /api/settings/contract-types

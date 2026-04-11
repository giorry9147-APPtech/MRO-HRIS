# Technical Architecture

## Recommended Stack

- Frontend: Next.js
- Backend: Laravel
- Database: PostgreSQL
- File storage: S3-compatible private storage
- Auth: Laravel Sanctum (or JWT)
- Reverse proxy: Nginx

## MVP Deployment Topology

- Single server for app + database (phase 1)
- Private document storage (same server or external S3-compatible)
- Automated backups
- Background jobs enabled in backend

## Backend Domains

- Auth and Users
- Organization
- Job Functions
- Positions
- Employees
- Employment Records
- Qualifications
- Documents
- Pay Scales
- Salary Assignments
- Assets
- Reports
- Audit Logs
- Settings

## Frontend Route Groups

- app/(dashboard)/dashboard
- app/(dashboard)/employees
- app/(dashboard)/employees/[id]
- app/(dashboard)/positions
- app/(dashboard)/functions
- app/(dashboard)/departments
- app/(dashboard)/documents
- app/(dashboard)/assets
- app/(dashboard)/reports
- app/(dashboard)/settings

## Security Principles

- RBAC for all modules
- Server-side validation
- HTTPS only
- Private document storage
- Signed downloads after authorization checks
- Audit logs for critical mutations
- Backups and restore procedure

## Build Rules

- No business logic in controllers
- Use services for domain logic
- Use migrations for all schema changes
- Use policies/guards for authorization
- Centralize search/filter logic
- Keep enums and status values documented

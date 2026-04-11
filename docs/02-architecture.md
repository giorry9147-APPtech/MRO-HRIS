# Architectuur

## Stack

Frontend:
- Next.js

Backend:
- Laravel

Database:
- PostgreSQL

Storage:
- Secure file storage (S3 of lokaal beschermd)

## Architectuur

User -> Frontend -> API -> Backend -> Database

Backend modules:
- Auth
- Employees
- Positions
- Documents
- Salary
- Assets
- Reports

## Security
- Role-based access
- JWT of session auth
- Audit logs
- HTTPS

## Belangrijk
- Geen business logic in controllers
- Gebruik services
- Gebruik migrations

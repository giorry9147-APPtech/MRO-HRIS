# Project Mapstructuur

## Backend (Laravel)

```text
backend/
├── app/
│   ├── Actions/
│   ├── DTOs/
│   ├── Enums/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── EmployeeController.php
│   │   │   ├── DepartmentController.php
│   │   │   ├── DirectorateController.php
│   │   │   ├── JobFunctionController.php
│   │   │   ├── PositionController.php
│   │   │   ├── EmploymentController.php
│   │   │   ├── DocumentController.php
│   │   │   ├── QualificationController.php
│   │   │   ├── SalaryController.php
│   │   │   ├── AssetController.php
│   │   │   ├── AssetAssignmentController.php
│   │   │   ├── ReportController.php
│   │   │   └── UserController.php
│   │   ├── Requests/
│   │   │   ├── StoreEmployeeRequest.php
│   │   │   ├── UpdateEmployeeRequest.php
│   │   │   └── README.md
│   │   └── Resources/
│   │       ├── EmployeeResource.php
│   │       └── README.md
│   ├── Models/
│   │   ├── Employee.php
│   │   ├── Department.php
│   │   ├── Directorate.php
│   │   ├── JobFunction.php
│   │   ├── Position.php
│   │   ├── EmploymentRecord.php
│   │   ├── Qualification.php
│   │   ├── EmployeeDocument.php
│   │   ├── SalaryAssignment.php
│   │   ├── Asset.php
│   │   ├── AssetAssignment.php
│   │   ├── User.php
│   │   └── Role.php
│   ├── Services/
│   │   ├── EmployeeService.php
│   │   ├── PositionService.php
│   │   ├── SalaryService.php
│   │   ├── AssetService.php
│   │   └── ReportService.php
│   └── Policies/
│       ├── EmployeePolicy.php
│       ├── DocumentPolicy.php
│       └── README.md
└── database/
    ├── migrations/
    └── seeders/
        ├── RoleSeeder.php
        ├── PermissionSeeder.php
        └── AdminUserSeeder.php
```

## Frontend (Next.js)

```text
frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── employees/
│   │   ├── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── departments/
│   │   └── page.tsx
│   ├── directorates/
│   │   └── page.tsx
│   ├── functions/
│   │   └── page.tsx
│   ├── positions/
│   │   └── page.tsx
│   ├── documents/
│   │   └── page.tsx
│   ├── assets/
│   │   └── page.tsx
│   └── reports/
│       └── page.tsx
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── ui/
│   │   ├── Table.tsx
│   │   ├── Form.tsx
│   │   ├── Modal.tsx
│   │   ├── Tabs.tsx
│   │   └── Badge.tsx
│   └── employee/
│       ├── EmployeeForm.tsx
│       └── EmployeeTabs.tsx
└── lib/
    ├── api.ts
    ├── auth.ts
    └── utils.ts
```

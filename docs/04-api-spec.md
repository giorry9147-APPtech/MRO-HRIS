# API Specificatie

## Auth

POST /api/auth/login  
POST /api/auth/logout  
GET /api/auth/me  

---

## Employees

GET /api/employees  
POST /api/employees  
GET /api/employees/{id}  
PUT /api/employees/{id}  
DELETE /api/employees/{id}  

---

## Departments

GET /api/departments  
POST /api/departments  

---

## Positions

GET /api/positions  
POST /api/positions  

---

## Documents

POST /api/documents/upload  
GET /api/documents/{employee_id}  

---

## Assets

GET /api/assets  
POST /api/assets  

---

## Salary

POST /api/salary-assignments  
GET /api/salary-assignments/{employee_id}  

---

## Reports

GET /api/reports/headcount  
GET /api/reports/by-department  

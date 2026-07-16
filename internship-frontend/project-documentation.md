# Project Documentation
## Employee Helpdesk — Ticket Management System

**Prepared by:** Harshita Gupta
**Date:** July 14, 2026
**Internship Organization:** Aeologic Technology pvt.Ltd

---

## 1. Project Overview
The Employee Helpdesk Ticket Management System is a comprehensive web application developed to streamline internal IT support operations. It enables employees to raise support tickets, managers to track and assign them, and administrators to manage the entire system with detailed analytics and reporting.

---

## 2. Features Implemented

### Core Features:
- ✅ User Authentication (Login/Logout with JWT)
- ✅ Role-Based Access Control (Admin, Manager, Employee)
- ✅ Dashboard with Analytics Charts
- ✅ Ticket CRUD Operations
- ✅ Ticket Assignment & Reassignment
- ✅ Status Management
- ✅ Comments & Activity History
- ✅ File Attachments (Upload/Download)
- ✅ User Management
- ✅ Department Management
- ✅ Reports with Filters
- ✅ CSV & PDF Export
- ✅ Email Notification Preferences
- ✅ User Profile (Edit + Change Password + Photo Upload)
- ✅ Tickets By Department visualization
- ✅ Access Denied page

---

## 3. Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Angular 17 |
| Language | TypeScript |
| Styling | CSS3 (Custom Design System) |
| Charts | Chart.js |
| Forms | Angular Reactive Forms |
| HTTP | Angular HttpClient |
| Auth | JWT + Angular Route Guards |
| Backend | Laravel (PHP) |
| Database | MySQL |
| Auth Backend | Laravel Sanctum |
| PDF Generation | DomPDF |

---

## 4. Application Architecture
Frontend (Angular)
├── Components (Pages)
│   ├── Auth: Login
│   ├── Dashboard (Charts + Stats)
│   ├── Tickets (List, Add, Edit, Details)
│   ├── Users (Management)
│   ├── Departments (Management)
│   ├── Reports (Filters + Export)
│   ├── Profile (Edit + Password)
│   └── Access Denied
├── Guards (AuthGuard, RoleGuard)
├── Services (TicketService, AuthService, etc.)
├── Interceptors (AuthInterceptor — JWT token)
└── Models (Ticket, User, Department, etc.)
Backend (Laravel)
├── Controllers (Auth, Ticket, User, Department, Report)
├── Models (User, Ticket, Department, Comment, Attachment)
├── Middleware (RoleMiddleware, Sanctum Auth)
└── Routes (api.php)
---

## 5. API Integration Flow
Angular Component
→ HttpClient Request
→ AuthInterceptor (adds Bearer token)
→ Laravel API
→ Sanctum Auth Middleware
→ Controller
→ Model/Database
→ JSON Response
→ Component (displays data)
---

## 6. Folder Structure
src/app/
├── guards/ — AuthGuard, RoleGuard
├── interceptors/ — AuthInterceptor
├── models/ — TypeScript interfaces
├── services/ — API service classes
├── components/
│ ├── dashboard/
│ ├── ticket-list/
│ ├── ticket-details/
│ ├── add-ticket/
│ ├── edit-ticket/
│ ├── user-management/
│ ├── department-list/
│ ├── reports/
│ ├── profile/
│ ├── tickets-by-department/
│ ├── access-denied/
│ └── notification/
└── app.module.ts


---

## 7. Challenges Faced

1. **RBAC Implementation** — Managing 3 different roles with different permissions required careful route guard design and sidebar conditional rendering.

2. **Chart.js Integration** — Rendering charts after API data loaded required `setTimeout` and proper `ngAfterViewInit` lifecycle handling.

3. **Backend Merge Conflicts** — Working in a team with shared backend repo led to frequent merge conflicts, especially in `laravel.log` and `AuthController.php`. Resolved by learning git merge strategies.

4. **API Response Format Inconsistency** — Backend sometimes returned `res.data`, sometimes direct array. Handled with fallback: `res.data || res || []`.

5. **Notification Preferences** — Database column mismatch (4 boolean columns vs 1 JSON column) required multiple fixes between frontend and backend team.

---

## 8. Key Learnings

- Angular component lifecycle, reactive forms, and route guards
- JWT authentication flow in Angular
- REST API integration with error handling
- Chart.js for data visualization
- Git workflow in team environment (pull, merge, conflict resolution)
- RBAC design patterns
- Responsive CSS design
- Laravel API development basics
- Cross-team communication and API contract negotiation

---

## 9. Future Enhancements

- Real-time notifications using WebSockets
- Mobile app (Angular + Capacitor)
- Advanced analytics dashboard
- SLA tracking and escalation
- Multi-language support
- Dark mode
- Audit logs for all actions
- Bulk ticket operations

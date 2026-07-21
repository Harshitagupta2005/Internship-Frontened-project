# 🎫 Employee Helpdesk — Ticket Management System

A full-stack web application for managing employee support tickets. Employees can raise tickets, managers can assign and track them, and admins can manage users, departments, and generate detailed reports — all with role-based access control.

Built during a Web Developer Internship at **Aeologic Technology Pvt. Ltd.**

---

## 🔗 Repository

**GitHub Repository:** [https://github.com/Harshitagupta2005/Internship-Frontened-project](https://github.com/Harshitagupta2005/Internship-Frontened-project)

---

## 🎥 Demo Video

📽️ **Watch the full project walkthrough:** [Demo Video Link](https://1drv.ms/v/c/a2a2cccba692dd19/IQB7XDAKHKajQYh5nRtuMxOzAZOxRMMAE9E2VmpNlqTcEfo?e=vmWdOf)

---

## 🌐 Live Demo

🔗 **Live URL:** [https://internship-frontened-project.vercel.app](https://internship-frontened-project.vercel.app)

> Note: This is the frontend deployment only. Backend features (login, tickets, reports) require the Laravel API running separately — see Installation Steps below to run the full stack locally.

---

## 📖 Project Overview

The Employee Helpdesk Ticket Management System streamlines internal IT support operations by replacing manual, informal issue reporting with a centralized platform. Employees raise tickets, managers assign and track resolution, and administrators oversee the full system — including user management, department management, email notifications, and exportable analytics/reports.

---

## 🛠️ Technology Stack

### Frontend
- Angular 17
- TypeScript
- Chart.js (Analytics — Pie & Bar charts)
- HTML5 / CSS3 (Custom Design System)
- Angular Reactive Forms
- Angular Route Guards (RBAC — AuthGuard, RoleGuard)
- Angular HttpClient + AuthInterceptor (JWT)

### Backend
- Laravel (PHP)
- **PostgreSQL** (Database)
- Laravel Sanctum (Authentication)
- DomPDF (PDF Export)
- SMTP Mail (Email Notifications)

---

## 📦 Installation Steps

### Prerequisites
- Node.js (v18+) and npm
- Angular CLI (`npm install -g @angular/cli`)
- PHP (v8.1+) and Composer
- PostgreSQL (v14+)

### Frontend Setup
```bash
# Clone repository
git clone https://github.com/Harshitagupta2005/Internship-Frontened-project
cd internship-frontend

# Install dependencies
npm install

# Install PDF export dependencies
npm install jspdf html2canvas --save
```

### Backend Setup
```bash
cd Internship-Backend

# Install dependencies
composer install

# Environment setup
cp .env.example .env
php artisan key:generate
```

Configure your `.env` file with the following:
```env
DB_CONNECTION=pgsql
DB_HOST=https://internship-backend-production.up.railway.app
DB_PORT=5432
DB_DATABASE=employee_helpdesk
DB_USERNAME=postgres
DB_PASSWORD=your_password

MAIL_MAILER=smtp
MAIL_HOST=https://internship-backend-production.up.railway.app
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="helpdesk@example.com"
MAIL_FROM_NAME="Helpdesk System"
```
> 💡 For local email testing, tools like **Mailhog** or **Mailtrap** can be run on `https://internship-backend-production.up.railway.app` to catch outgoing notification emails without sending real mail.

```bash
# Database setup
php artisan migrate
php artisan db:seed
```

---

## 🚀 Running the Application

### Start Backend
```bash
cd Internship-Backend
php artisan serve
# Runs on https://internship-backend-production.up.railway.app
```

### Start Frontend
```bash
cd internship-frontend
ng serve
# Runs on http://localhost:4200
```

- **Frontend:** http://localhost:4200
- **Backend API:** https://internship-backend-production.up.railway.app/api

---

## ✨ Project Features

### Authentication & Security
- JWT-based login/logout via Laravel Sanctum
- Role-Based Access Control (Admin, Manager, Employee)
- Route Guards (AuthGuard, RoleGuard) for page protection
- Access Denied page for unauthorized access attempts

### Dashboard
- Stats widgets (Total, Open, In Progress, Closed tickets)
- Pie Chart — Ticket Status Distribution
- Bar Chart — Tickets by Department
- Recent Tickets table

### Ticket Management
- Create, Edit, Delete tickets
- Assign / reassign tickets to users
- Status management
- File attachments (upload/download)
- Comments section
- Activity history timeline

### User Management
- Add/Edit/Delete users
- Role assignment (Admin, Manager, Employee)

### Department Management
- Add/Edit/Delete departments
- Tickets by Department visualization

### Reports
- Advanced filtering (Department, Status, Priority, Date Range)
- CSV Export
- PDF Export (DomPDF) — includes report title, generation date/time, applied filters, and total record count
- Print Report with dedicated print layout
- Loading indicators and success/error notifications on export

### User Profile
- View/Edit profile
- Change password with strength indicator
- Profile photo upload
- Email notification preferences

### Notifications
- Real-time success/error toast notifications
- Email notifications via SMTP (e.g., ticket assignment, status updates)

---

## 👥 User Roles

| Role | Access |
|------|--------|
| Admin | Full access to all modules |
| Manager | Tickets, Dashboard, Reports, Assignments |
| Employee | Own tickets and profile only |

---

## 📁 Folder Structure

**Frontend (Angular) — `src/app/`:**
```
├── access-denied/
├── add-department/
├── add-ticket/
├── add-user/
├── assign-ticket/
├── dashboard/
├── department-list/
├── edit-ticket/
├── footer/
├── guards/              — AuthGuard, RoleGuard
├── header/
├── home/
├── interceptors/         — AuthInterceptor
├── login/
├── models/               — activity.model.ts, attachment.model.ts, comment.ts, department.ts, ticket.ts
├── reports/
├── services/              — API service classes
├── sidebar/
├── ticket-attachments/
├── ticket-details/
├── ticket-list/
├── tickets-by-department/
├── user-management/
└── app.module.ts
```

**Backend (Laravel) — `app/`:**
```
├── Http/
│   ├── Controllers/    — Auth, Ticket, User, Department, Report
│   └── Middleware/       — RoleMiddleware, Sanctum Auth
├── Models/                — User, Ticket, Department, Comment, Attachment
routes/
└── api.php
```

---

## 📌 Notes
- Ensure `.env` has correct **PostgreSQL** credentials (`DB_CONNECTION=pgsql`) before running migrations.
- Update `apiUrl` in Angular environment files if the backend runs on a different host/port.
- Configure SMTP mail settings for email notification features to work locally.

# 🎫 Employee Helpdesk — Ticket Management System

## Project Overview
A full-stack web application for managing employee support tickets, built during internship at [Company Name]. The system allows employees to raise tickets, managers to assign and track them, and admins to manage users, departments, and generate reports.

## 🛠️ Technology Stack

### Frontend
- Angular 17
- TypeScript
- Chart.js (Analytics)
- HTML5 / CSS3
- Angular Reactive Forms
- Angular Route Guards (RBAC)

### Backend
- Laravel (PHP)
- MySQL
- Laravel Sanctum (Authentication)
- DomPDF (PDF Export)

## 📦 Installation Steps

### Frontend Setup
```bash
# Clone repository
git clone https://github.com/Harshitagupta2005/Internship-Frontened-project
cd internship-frontend

# Install dependencies
npm install

# Run the application
ng serve
```

### Backend Setup
```bash
cd Internship-Backend

# Install dependencies
composer install

# Environment setup
cp .env.example .env
php artisan key:generate

# Database setup
php artisan migrate
php artisan db:seed

# Run server
php artisan serve
```

## 🚀 Running the Application
- Frontend: `http://localhost:4200`
- Backend API: `http://localhost:8000/api`

## ✨ Project Features

### Authentication & Security
- JWT-based login/logout
- Role-Based Access Control (RBAC)
- Route Guards for page protection

### Dashboard
- Stats widgets (Total, Open, In Progress, Closed tickets)
- Pie Chart — Ticket Status Distribution
- Bar Chart — Tickets by Department
- Recent Tickets table

### Ticket Management
- Create, Edit, Delete tickets
- Assign tickets to users
- Status management
- File attachments (upload/download)
- Comments section
- Activity History Timeline

### User Management
- Add/Edit/Delete users
- Role assignment (Admin, Manager, Employee)

### Department Management
- Add/Edit/Delete departments
- Tickets by Department view

### Reports
- Advanced filtering (Department, Status, Priority, Date Range)
- CSV Export
- PDF Export

### User Profile
- View/Edit profile
- Change password with strength indicator
- Profile photo upload
- Email notification preferences

### Notifications
- Real-time success/error notifications
- Email notification preferences

## 👥 User Roles
| Role | Access |
|------|--------|
| Admin | Full access to all modules |
| Manager | Tickets, Dashboard, Reports, Assignments |
| Employee | Own tickets and profile only |
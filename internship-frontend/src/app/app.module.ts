import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';   // 👈 ADD KIYA
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { ContactComponent } from './contact/contact.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { AddTicketComponent } from './add-ticket/add-ticket.component';
import { EditTicketComponent } from './edit-ticket/edit-ticket.component';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
import { NotificationComponent } from './notification/notification.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { UserManagementComponent } from './user-management/user-management.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AssignTicketComponent } from './assign-ticket/assign-ticket.component';
import { DepartmentListComponent } from './department-list/department-list.component';
import { AddDepartmentComponent } from './add-department/add-department.component';



const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactComponent, canActivate: [AuthGuard] },
  { path: 'tickets', component: TicketListComponent, canActivate: [AuthGuard] },
  { path: 'tickets/add', component: AddTicketComponent, canActivate: [AuthGuard] },
  { path: 'tickets/edit/:id', component: EditTicketComponent, canActivate: [AuthGuard] },
  { path: 'tickets/:id', component: TicketDetailsComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UserManagementComponent, canActivate: [AuthGuard] },
{ path: 'users/add', component: AddUserComponent, canActivate: [AuthGuard] },
{ path: 'tickets/assign/:id', component: AssignTicketComponent, canActivate: [AuthGuard] },
{ path: 'departments', component: DepartmentListComponent, canActivate: [AuthGuard] },
{ path: 'departments/add', component: AddDepartmentComponent, canActivate: [AuthGuard] },
 { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent, HeaderComponent, FooterComponent,
    HomeComponent, DashboardComponent, ProfileComponent,
    ContactComponent, SidebarComponent, TicketListComponent,
    AddTicketComponent, EditTicketComponent, TicketDetailsComponent,
    NotificationComponent, LoginComponent, UserManagementComponent, AddUserComponent, AssignTicketComponent,DepartmentListComponent,
  AddDepartmentComponent 
  ],
  imports: [
    BrowserModule,
    CommonModule,   // 👈 ADD KIYA
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,   // 👈 Fix
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'tickets', component: TicketListComponent },
  { path: 'tickets/add', component: AddTicketComponent },
  { path: 'tickets/edit/:id', component: EditTicketComponent },
  { path: 'tickets/:id', component: TicketDetailsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent, HeaderComponent, FooterComponent,
    HomeComponent, DashboardComponent, ProfileComponent,
    ContactComponent, SidebarComponent, TicketListComponent,
    AddTicketComponent, EditTicketComponent, TicketDetailsComponent,
    NotificationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
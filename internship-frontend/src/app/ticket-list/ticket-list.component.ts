import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TicketService } from '../services/ticket.service';
import { Ticket } from '../models/ticket';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {

  tickets: Ticket[] = [];
  departments: any[] = [];
  searchText = '';
  selectedDepartmentId = '';
  isLoading = true;
  errorMessage = '';

  showNotification = false;
  notifType: 'success' | 'error' | 'warning' = 'success';
  notifMessage = '';

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  totalTickets = 0;

  sortColumn: string = 'id';
  sortDirection: 'asc' | 'desc' = 'desc';

  statusOptions = [
    { value: 'open', label: 'open' },
    { value: 'in_progress', label: 'in_progress' },
    { value: 'closed', label: 'closed' }
  ];

  showAssignDialog = false;
  selectedTicketId: string = '';
  selectedTicketAssignedToId: string = '';

  private apiUrl = 'https://internship-backend-production.up.railway.app/api';

  constructor(
    private ticketService: TicketService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadTickets();
    this.loadDepartments();
  }
loadTickets() {
  this.isLoading = true;

  this.ticketService
    .getTickets(this.currentPage, this.selectedDepartmentId)
    .subscribe({
      next: (res: any) => {
        this.tickets = res.data || [];
        this.totalPages = res.meta?.last_page || 1;
        this.currentPage = res.meta?.current_page || 1;
        this.totalTickets = res.meta?.total || 0;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load tickets.';
        this.isLoading = false;
      }
    });
}


  loadDepartments() {
    this.http.get<any>(`${this.apiUrl}/departments`).subscribe({
      next: (res) => {
        const depts = res.data || res || [];
        // Deduplicate
        const seen = new Set<string>();
        this.departments = depts.filter((d: any) => {
          if (seen.has(d.name)) return false;
          seen.add(d.name);
          return true;
        });
      },
      error: () => {}
    });
  }

  onDepartmentFilter() {
  this.currentPage = 1;
  this.loadTickets();
}

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1;
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return '↕';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  get filteredTickets(): Ticket[] {
    let result = this.tickets;

    // Keyword search
    if (this.searchText) {
      const s = this.searchText.toLowerCase();
      result = result.filter((t: any) =>
        (t.title || '').toLowerCase().includes(s) ||
        (t.status || '').toLowerCase().includes(s) ||
        (t.assignedTo || '').toLowerCase().includes(s) ||
        (t.department || '').toLowerCase().includes(s)
      );
    }

    // Department filter
    if (this.selectedDepartmentId) {
      result = result.filter((t: any) =>
        String(t.department_id) === String(this.selectedDepartmentId)
      );
    }

    return result;
  }

  get sortedTickets(): Ticket[] {
    return [...this.filteredTickets].sort((a: any, b: any) => {
      let valA = a[this.sortColumn] ?? '';
      let valB = b[this.sortColumn] ?? '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

 get paginatedTickets(): Ticket[] {
  return this.sortedTickets;
}

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

 changePage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.loadTickets();
  }
}

  showNotif(type: 'success' | 'error' | 'warning', message: string) {

    this.notifType = type;
    this.notifMessage = message;
    this.showNotification = true;
    setTimeout(() => { this.showNotification = false; }, 3000);
  }

  deleteTicket(ticket: Ticket) {
    if (!window.confirm(`Delete ticket "${ticket.title}"?`)) return;
    this.ticketService.deleteTicket(String(ticket.id)).subscribe({
      next: () => {
        this.tickets = this.tickets.filter(t => t.id !== ticket.id);
        if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
        this.showNotif('success', 'Ticket deleted successfully!');
      },
      error: () => { this.showNotif('error', 'Failed to delete ticket'); }
    });
  }

  openAssignDialog(ticket: Ticket) {
    this.selectedTicketId = String(ticket.id);
    this.selectedTicketAssignedToId = ticket.assignedToId || '';
    this.showAssignDialog = true;
  }

  closeAssignDialog() { this.showAssignDialog = false; }

  onAssignResult(result: { success: boolean; message: string }) {
    this.showAssignDialog = false;
    this.showNotif(result.success ? 'success' : 'error', result.message);
    if (result.success) { this.loadTickets(); }
  }

  onStatusChange(ticket: Ticket, newStatus: string) {
    const oldStatus = ticket.status;
    ticket.status = newStatus;
    this.ticketService.updateStatus(String(ticket.id), newStatus).subscribe({
      next: () => { this.showNotif('success', `Status updated to "${newStatus}"`); },
      error: () => {
        ticket.status = oldStatus;
        this.showNotif('error', 'Failed to update status.');
      }
    });
  }

  getBadgeClass(status: string): string {
    const normalized = (status || '').toLowerCase().replace(' ', '_');
    return 'badge-' + normalized;
  }
}
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  // Filters
  filters = {
    department_id: '',
    status: '',
    priority: '',
    from_date: '',
    to_date: ''
  };

  // Data
  reportData: any[] = [];
  totalRecords = 0;
  departments: any[] = [];

  // States
  isLoading = false;
  isExporting = false;
  hasSearched = false;
  errorMessage = '';

  // Notification
  showNotification = false;
  notifType: 'success' | 'error' | 'warning' = 'success';
  notifMessage = '';

  statusOptions = ['open', 'in_progress', 'closed'];
  priorityOptions = ['high', 'medium', 'low'];

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.http.get<any>(`${this.apiUrl}/departments`).subscribe({
      next: (res) => {
        const depts = res.data || res || [];
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

  applyFilters() {
    this.isLoading = true;
    this.hasSearched = true;
    this.errorMessage = '';

    const params = this.buildParams();
    this.http.get<any>(`${this.apiUrl}/reports?${params}`).subscribe({
      next: (res) => {
        this.reportData = res.data || [];
        this.totalRecords = res.total || this.reportData.length;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load report data. Please try again.';
        console.error('Report error:', err);
      }
    });
  }

  resetFilters() {
    this.filters = {
      department_id: '',
      status: '',
      priority: '',
      from_date: '',
      to_date: ''
    };
    this.reportData = [];
    this.totalRecords = 0;
    this.hasSearched = false;
    this.errorMessage = '';
  }

  exportCSV() {
    // Option 1: Backend CSV export (agar /api/reports/export available hai)
    this.isExporting = true;
    const params = this.buildParams();

    this.http.get(`${this.apiUrl}/reports/export?${params}`, {
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tickets_report_${new Date().toISOString().slice(0,10)}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.isExporting = false;
        this.showNotif('success', 'Report exported successfully!');
      },
      error: () => {
        // Fallback: Frontend CSV export
        this.exportCSVFrontend();
      }
    });
  }

  exportCSVFrontend() {
    if (this.reportData.length === 0) {
      this.showNotif('warning', 'No data to export. Please apply filters first.');
      this.isExporting = false;
      return;
    }

    const headers = ['ID', 'Title', 'Status', 'Priority', 'Department', 'Assigned To', 'Created Date'];
    const rows = this.reportData.map(t => [
      t.id,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      t.status,
      t.priority,
      t.department || 'N/A',
      t.assigned_to || 'Unassigned',
      t.created_at || ''
    ]);

    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tickets_report_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    this.isExporting = false;
    this.showNotif('success', 'Report exported successfully!');
  }

  buildParams(): string {
    const p: string[] = [];
    if (this.filters.department_id) p.push(`department_id=${this.filters.department_id}`);
    if (this.filters.status)        p.push(`status=${this.filters.status}`);
    if (this.filters.priority)      p.push(`priority=${this.filters.priority}`);
    if (this.filters.from_date)     p.push(`from_date=${this.filters.from_date}`);
    if (this.filters.to_date)       p.push(`to_date=${this.filters.to_date}`);
    p.push('per_page=100');
    return p.join('&');
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'open':        return 'status-open';
      case 'in_progress': return 'status-progress';
      case 'closed':      return 'status-closed';
      default:            return '';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority?.toLowerCase()) {
      case 'high':   return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low':    return 'priority-low';
      default:       return '';
    }
  }

  showNotif(type: 'success' | 'error' | 'warning', message: string) {
    this.notifType = type;
    this.notifMessage = message;
    this.showNotification = true;
    setTimeout(() => { this.showNotification = false; }, 3000);
  }
}
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  isExporting = false;       // used for CSV
  isGeneratingReport = false; // used for PDF / Print
  hasSearched = false;
  errorMessage = '';

  // Notification
  showNotification = false;
  notifType: 'success' | 'error' | 'warning' = 'success';
  notifMessage = '';

  statusOptions = ['open', 'in_progress', 'closed'];
  priorityOptions = ['high', 'medium', 'low'];

  reportTitle = 'AeoLogic Technologies — Employee Helpdesk & Ticket Management System';

  private apiUrl = 'https://internship-backend-production.up.railway.app/api';

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

  /** ---------------- PDF EXPORT ---------------- */
  exportPDF() {
    if (this.reportData.length === 0) {
      this.showNotif('warning', 'No data to export. Please apply filters first.');
      return;
    }

    this.isGeneratingReport = true;

    // give Angular a tick to render the print-section with latest data
    setTimeout(() => {
      const element = document.getElementById('printSection');
      if (!element) {
        this.isGeneratingReport = false;
        this.showNotif('error', 'Could not generate PDF. Please try again.');
        return;
      }

      html2canvas(element, { scale: 2, useCORS: true }).then(canvas => {
        try {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();

          const imgWidth = pageWidth;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          let heightLeft = imgHeight;
          let position = 0;

          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }

          pdf.save(`tickets_report_${new Date().toISOString().slice(0,10)}.pdf`);
          this.isGeneratingReport = false;
          this.showNotif('success', 'PDF report generated successfully!');
        } catch (err) {
          console.error('PDF generation error:', err);
          this.isGeneratingReport = false;
          this.showNotif('error', 'Failed to generate PDF. Please try again.');
        }
      }).catch(err => {
        console.error('html2canvas error:', err);
        this.isGeneratingReport = false;
        this.showNotif('error', 'Failed to generate PDF. Please try again.');
      });
    }, 100);
  }

  /** ---------------- PRINT ---------------- */
  printReport() {
    if (this.reportData.length === 0) {
      this.showNotif('warning', 'No data to print. Please apply filters first.');
      return;
    }

    this.isGeneratingReport = true;

    setTimeout(() => {
      this.isGeneratingReport = false;
      window.print();
    }, 100);
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

  getDepartmentName(): string {
    const dept = this.departments.find(d => String(d.id) === String(this.filters.department_id));
    return dept ? dept.name : '';
  }

  /** Human-readable summary of applied filters, for report header */
  getAppliedFiltersSummary(): string[] {
    const summary: string[] = [];
    if (this.filters.department_id) summary.push(`Department: ${this.getDepartmentName()}`);
    if (this.filters.status)        summary.push(`Status: ${this.filters.status}`);
    if (this.filters.priority)      summary.push(`Priority: ${this.filters.priority}`);
    if (this.filters.from_date)     summary.push(`From: ${this.filters.from_date}`);
    if (this.filters.to_date)       summary.push(`To: ${this.filters.to_date}`);
    return summary.length ? summary : ['No filters applied (showing all records)'];
  }

  getGeneratedTimestamp(): string {
    const now = new Date();
    return now.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
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
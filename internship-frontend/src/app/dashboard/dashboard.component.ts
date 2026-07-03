import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { TicketService } from '../services/ticket.service';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('pieCanvas') pieCanvas!: ElementRef;
  @ViewChild('barCanvas') barCanvas!: ElementRef;

  private pieChart: Chart | null = null;
  private barChart: Chart | null = null;

  cards = [
    { label: 'Total Tickets',       value: '...', icon: '🎫', color: '#1D9E75' },
    { label: 'Open Tickets',         value: '...', icon: '📂', color: '#e67e22' },
    { label: 'In Progress',          value: '...', icon: '⏳', color: '#3498db' },
    { label: 'Closed Tickets',       value: '...', icon: '✅', color: '#95a5a6' },
  ];

  recentTickets: any[] = [];
  isLoading = true;
  isLoadingTickets = true;
  statsLoaded = false;

  private stats: any = null;
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(
    private ticketService: TicketService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadRecentTickets();
  }

  ngAfterViewInit() {
    // Charts will be rendered after stats load
  }

  ngOnDestroy() {
    if (this.pieChart) this.pieChart.destroy();
    if (this.barChart) this.barChart.destroy();
  }

  loadStats() {
    this.ticketService.getStats().subscribe({
      next: (stats: any) => {
        this.cards[0].value = String(stats.total ?? 0);
        this.cards[1].value = String(stats.open ?? 0);
        this.cards[2].value = String(stats.in_progress ?? 0);
        this.cards[3].value = String(stats.closed ?? 0);
        this.stats = stats;
        this.isLoading = false;
        this.statsLoaded = true;
        setTimeout(() => this.renderCharts(), 100);
      },
      error: () => {
        this.cards.forEach(c => c.value = 'N/A');
        this.isLoading = false;
        this.statsLoaded = true;
        setTimeout(() => this.renderChartsWithFallback(), 100);
      }
    });
  }

  loadRecentTickets() {
    this.ticketService.getRecentTickets().subscribe({
      next: (tickets) => {
        this.recentTickets = tickets;
        this.isLoadingTickets = false;
      },
      error: () => { this.isLoadingTickets = false; }
    });
  }

  renderCharts() {
    this.renderPieChart();
    this.renderBarChart();
  }

  renderChartsWithFallback() {
    this.renderPieChartWithData(
      ['Open', 'In Progress', 'Closed'],
      [0, 0, 0]
    );
    this.renderBarChartWithData([], []);
  }

  renderPieChart() {
    const open       = Number(this.cards[1].value) || 0;
    const inProgress = Number(this.cards[2].value) || 0;
    const closed     = Number(this.cards[3].value) || 0;
    this.renderPieChartWithData(
      ['Open', 'In Progress', 'Closed'],
      [open, inProgress, closed]
    );
  }

  renderPieChartWithData(labels: string[], data: number[]) {
    if (!this.pieCanvas) return;
    if (this.pieChart) this.pieChart.destroy();

    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#e67e22', '#3498db', '#95a5a6'],
          borderColor: ['#fff', '#fff', '#fff'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: {
            display: true,
            text: 'Ticket Distribution by Status',
            font: { size: 14, weight: 'bold' },
            color: '#0a3d2b'
          }
        }
      }
    });
  }

  renderBarChart() {
    // Try to get department data from stats
    if (this.stats?.by_department && this.stats.by_department.length > 0) {
      const labels = this.stats.by_department.map((d: any) => d.name || d.department || 'Unknown');
      const data   = this.stats.by_department.map((d: any) => d.count || d.total || 0);
      this.renderBarChartWithData(labels, data);
    } else {
      // Fallback: load from departments API
      this.http.get<any>(`${this.apiUrl}/departments`).subscribe({
        next: (res) => {
          const depts = res.data || res || [];
          const labels = depts.map((d: any) => d.name || 'Unknown');
          const data   = depts.map((d: any) => d.tickets_count || 0);
          this.renderBarChartWithData(labels, data);
        },
        error: () => this.renderBarChartWithData([], [])
      });
    }
  }

  renderBarChartWithData(labels: string[], data: number[]) {
    if (!this.barCanvas) return;
    if (this.barChart) this.barChart.destroy();

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels.length > 0 ? labels : ['No Data'],
        datasets: [{
          label: 'Tickets',
          data: data.length > 0 ? data : [0],
          backgroundColor: '#1D9E75',
          borderColor: '#17865f',
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Tickets by Department',
            font: { size: 14, weight: 'bold' },
            color: '#0a3d2b'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
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
}
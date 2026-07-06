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
    { label: 'Total Tickets',  value: '...', icon: '🎫', color: '#1D9E75' },
    { label: 'Open Tickets',   value: '...', icon: '📂', color: '#e67e22' },
    { label: 'In Progress',    value: '...', icon: '⏳', color: '#3498db' },
    { label: 'Closed Tickets', value: '...', icon: '✅', color: '#95a5a6' },
  ];

  recentTickets: any[] = [];
  isLoading = true;
  isLoadingTickets = true;
  statsLoaded = false;
  deptLabels: string[] = [];

  recentCurrentPage = 1;
  recentItemsPerPage = 5;

  private stats: any = null;
  private apiUrl = 'http://127.0.0.1:8000/api';

  private readonly colors = [
    '#1D9E75', '#3498db', '#e67e22', '#9b59b6',
    '#e74c3c', '#2ecc71', '#f39c12', '#1abc9c',
    '#d35400', '#8e44ad', '#2980b9', '#27ae60'
  ];

  constructor(
    private ticketService: TicketService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadRecentTickets();
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    if (this.pieChart) this.pieChart.destroy();
    if (this.barChart) this.barChart.destroy();
  }

  get paginatedRecentTickets(): any[] {
    const start = (this.recentCurrentPage - 1) * this.recentItemsPerPage;
    return this.recentTickets.slice(start, start + this.recentItemsPerPage);
  }

  get recentTotalPages(): number {
    return Math.ceil(this.recentTickets.length / this.recentItemsPerPage);
  }

  get recentPageNumbers(): number[] {
    return Array.from({ length: this.recentTotalPages }, (_, i) => i + 1);
  }

  changeRecentPage(page: number) {
    if (page >= 1 && page <= this.recentTotalPages) {
      this.recentCurrentPage = page;
    }
  }

  getDeptColor(i: number): string {
    return this.colors[i % this.colors.length];
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
      next: (tickets: any[]) => {
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
    this.renderPieChartWithData(['Open', 'In Progress', 'Closed'], [0, 0, 0]);
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
        labels,
        datasets: [{
          data,
          backgroundColor: ['#e67e22', '#3498db', '#95a5a6'],
          borderColor: ['#fff', '#fff', '#fff'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom' as const,
            align: 'center',
            labels: {
              font: { size: 13 },
              color: '#333',
              padding: 16,
              boxWidth: 20
            }
          },
          title: { display: false }
        }
      }
    });
  }

  renderBarChart() {
    this.http.get<any>(`${this.apiUrl}/departments`).subscribe({
      next: (res) => {
        const depts = res.data || res || [];
        const seen = new Set<string>();
        const unique = depts.filter((d: any) => {
          const name = d.name || 'Unknown';
          if (seen.has(name)) return false;
          seen.add(name);
          return true;
        });
        const labels = unique.map((d: any) => d.name || 'Unknown');
        const data   = unique.map((d: any) => d.tickets_count || 0);
        this.deptLabels = labels;
        this.renderBarChartWithData(labels, data);
      },
      error: () => this.renderBarChartWithData([], [])
    });
  }

  renderBarChartWithData(labels: string[], data: number[]) {
    if (!this.barCanvas) return;
    if (this.barChart) this.barChart.destroy();

    const bgColors = labels.map((_: any, i: number) =>
      this.colors[i % this.colors.length]
    );

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels.length > 0 ? labels : ['No Data'],
        datasets: [{
          label: 'Tickets',
          data: data.length > 0 ? data : [0],
          backgroundColor: bgColors,
          borderColor: '#fff',
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.y} Tickets`
            }
          }
        },
        scales: {
          x: { display: false },
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, font: { size: 12 }, color: '#555' },
            grid: { color: 'rgba(0,0,0,0.06)' },
            title: {
              display: true,
              text: 'Tickets',
              font: { size: 11 },
              color: '#555'
            }
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
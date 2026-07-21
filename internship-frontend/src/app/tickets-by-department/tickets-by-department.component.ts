import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-tickets-by-department',
  templateUrl: './tickets-by-department.component.html',
  styleUrls: ['./tickets-by-department.component.css']
})
export class TicketsByDepartmentComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('barCanvas') barCanvas!: ElementRef;
  private barChart: Chart | null = null;

  departments: any[] = [];
  deptLabels: string[] = [];
  isLoading = true;
  private dataLoaded = false;
  private viewReady = false;

  private apiUrl = 'YOUR_API_URL/api'; // apna URL daalo

  private readonly colors = [
    '#1D9E75', '#3498db', '#e67e22', '#9b59b6',
    '#e74c3c', '#2ecc71', '#f39c12', '#1abc9c',
    '#d35400', '#8e44ad', '#2980b9', '#27ae60'
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDepartments();
  }

  ngAfterViewInit() {
    this.viewReady = true;
    // Agar data pehle aa gaya ho
    if (this.dataLoaded) {
      setTimeout(() => this.renderChart(), 200);
    }
  }

  ngOnDestroy() {
    if (this.barChart) this.barChart.destroy();
  }

  getDeptColor(i: number): string {
    return this.colors[i % this.colors.length];
  }

  loadDepartments() {
    this.isLoading = true;
    this.http.get<any>(`${this.apiUrl}/departments`).subscribe({
      next: (res) => {
        const depts = res.data || res || [];
        const seen = new Set<string>();
        this.departments = depts.filter((d: any) => {
          if (seen.has(d.name)) return false;
          seen.add(d.name);
          return true;
        });
        this.deptLabels = this.departments.map((d: any) => d.name || 'Unknown');
        this.isLoading = false;
        this.dataLoaded = true;

        // View ready hai to render karo
        if (this.viewReady) {
          setTimeout(() => this.renderChart(), 200);
        }
      },
      error: () => { this.isLoading = false; }
    });
  }

  renderChart() {
    if (!this.barCanvas || !this.barCanvas.nativeElement) return;
    if (this.barChart) this.barChart.destroy();

    const labels = this.departments.map((d: any) => d.name || 'Unknown');
    const data = this.departments.map((d: any) => d.tickets_count || 0);
    const bgColors = labels.map((_: any, i: number) => this.colors[i % this.colors.length]);

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Tickets',
          data,
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
              text: 'Number of Tickets',
              font: { size: 12 },
              color: '#555'
            }
          }
        }
      }
    });
  }
}
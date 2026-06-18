import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeResponseDTO } from '../../models/employee.model';

declare const Chart: any;

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  employees: EmployeeResponseDTO[] = [];
  loading = true;
  error = '';
  successMessage = '';

  private charts: any[] = [];

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.error = '';
    this.employeeService.getAll().subscribe({
      next: data => {
        this.employees = data;
        this.loading = false;
        setTimeout(() => this.renderCharts(), 0);
      },
      error: err => { this.error = err.error?.message || 'Failed to load employees.'; this.loading = false; }
    });
  }

  private renderCharts(): void {
    if (typeof Chart === 'undefined') return;
    this.charts.forEach(c => c.destroy());
    this.charts = [];
    if (!this.employees || this.employees.length === 0) return;

    const palette = ['#6366f1', '#8b5cf6', '#06b6d4', '#14b8a6', '#ec4899', '#f59e0b', '#3b82f6', '#10b981', '#ef4444'];

    // Pie — Employees by Role
    const roleCounts: { [key: string]: number } = {};
    this.employees.forEach(e => {
      const r = e.role || 'Unknown';
      roleCounts[r] = (roleCounts[r] || 0) + 1;
    });
    const roleLabels = Object.keys(roleCounts);
    const roleData = roleLabels.map(l => roleCounts[l]);
    const roleEl = document.getElementById('employeesByRoleChart') as HTMLCanvasElement | null;
    if (roleEl) {
      this.charts.push(new Chart(roleEl, {
        type: 'pie',
        data: {
          labels: roleLabels,
          datasets: [{ data: roleData, backgroundColor: palette }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Employees by Role' }
          }
        }
      }));
    }

    // Bar — Employees by Grade
    const gradeCounts: { [key: string]: number } = {};
    this.employees.forEach(e => {
      const g = e.gradeName || 'Unassigned';
      gradeCounts[g] = (gradeCounts[g] || 0) + 1;
    });
    const gradeLabels = Object.keys(gradeCounts).sort();
    const gradeData = gradeLabels.map(l => gradeCounts[l]);
    const gradeEl = document.getElementById('employeesByGradeChart') as HTMLCanvasElement | null;
    if (gradeEl) {
      this.charts.push(new Chart(gradeEl, {
        type: 'bar',
        data: {
          labels: gradeLabels,
          datasets: [{ label: 'Employees', data: gradeData, backgroundColor: palette }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Employees by Grade' }
          },
          scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
        }
      }));
    }
  }

  ngOnDestroy(): void {
    this.charts.forEach(c => c.destroy());
  }

  deleteEmployee(id: number, name: string): void {
    if (!confirm(`Delete employee "${name}"? This cannot be undone.`)) return;
    this.employeeService.delete(id).subscribe({
      next: () => {
        this.successMessage = `Employee "${name}" deleted.`;
        this.loadEmployees();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: err => { this.error = err.error?.message || 'Delete failed.'; }
    });
  }
}

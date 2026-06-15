import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeResponseDTO } from '../../models/employee.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: EmployeeResponseDTO[] = [];
  loading = true;
  error = '';
  successMessage = '';

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.error = '';
    this.employeeService.getAll().subscribe({
      next: data => { this.employees = data; this.loading = false; },
      error: err => { this.error = err.error?.message || 'Failed to load employees.'; this.loading = false; }
    });
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

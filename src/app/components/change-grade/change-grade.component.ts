import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EmployeeService } from '../../services/employee.service';
import { GradeService } from '../../services/grade.service';
import { EmployeeResponseDTO } from '../../models/employee.model';
import { GradeResponseDTO } from '../../models/grade.model';

@Component({
  selector: 'app-change-grade',
  templateUrl: './change-grade.component.html',
  styleUrls: ['./change-grade.component.css']
})
export class ChangeGradeComponent implements OnInit {
  employee: EmployeeResponseDTO | null = null;
  availableGrades: GradeResponseDTO[] = [];
  selectedGradeId = 0;
  loading = true;
  submitting = false;
  error = '';
  success = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private gradeService: GradeService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    forkJoin({
      employee: this.employeeService.getById(id),
      grades:   this.gradeService.getAll()
    }).subscribe({
      next: ({ employee, grades }) => {
        this.employee = employee;
        const currentGradeId = grades.find(g => g.gradeName === employee.gradeName)?.id ?? 999;
        this.availableGrades = grades.filter(g => g.id < currentGradeId);
        this.selectedGradeId = this.availableGrades.length > 0 ? this.availableGrades[0].id : 0;
        this.loading = false;
      },
      error: err => {
        this.error = err.error?.message || 'Failed to load employee data.';
        this.loading = false;
      }
    });
  }

  onGradeSelect(event: Event): void {
    this.selectedGradeId = +(event.target as HTMLSelectElement).value;
  }

  onSubmit(): void {
    if (!this.employee || !this.selectedGradeId) return;
    this.submitting = true;
    this.error = '';

    const dto = {
      firstName:      this.employee.firstName,
      emailAddress:   this.employee.emailAddress,
      role:           this.employee.role,
      currentGradeId: this.selectedGradeId
    };

    this.employeeService.update(this.employee.employeeId, dto).subscribe({
      next: updated => {
        this.submitting = false;
        this.success = `Grade updated to ${updated.gradeName} successfully!`;
        setTimeout(() => this.router.navigate(['/employees']), 1500);
      },
      error: err => {
        this.submitting = false;
        this.error = err.error?.message || 'Failed to update grade.';
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { GradeService } from '../../services/grade.service';
import { GradeResponseDTO } from '../../models/grade.model';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  addForm!: FormGroup;
  grades: GradeResponseDTO[] = [];
  loading = false;
  gradeLoading = true;
  showPassword = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private gradeService: GradeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.addForm = this.fb.group({
      firstName:      ['', [Validators.required, Validators.minLength(2)]],
      emailAddress:   ['', [Validators.required, Validators.email,
                            Validators.pattern(/.*@cognizant\.com$/)]],
      password:       ['', [Validators.required, Validators.minLength(6)]],
      role:           ['Employee', Validators.required],
      currentGradeId: [3, Validators.required],
      accessGranted:  [true]
    });

    this.gradeService.getAll().subscribe({
      next: grades => { this.grades = grades; this.gradeLoading = false; },
      error: ()    => { this.gradeLoading = false; }
    });

    // TravelDeskExe is always Grade-1 (backend enforces it; mirror in UI)
    this.addForm.get('role')!.valueChanges.subscribe(role => {
      if (role === 'TravelDeskExe') {
        this.addForm.get('currentGradeId')!.setValue(1);
        this.addForm.get('currentGradeId')!.disable();
      } else {
        this.addForm.get('currentGradeId')!.enable();
      }
    });
  }

  get f() { return this.addForm.controls; }

  togglePassword(): void { this.showPassword = !this.showPassword; }

  onSubmit(): void {
    if (this.addForm.invalid) { this.addForm.markAllAsTouched(); return; }
    this.loading = true;
    this.error   = '';

    this.employeeService.create(this.addForm.getRawValue()).subscribe({
      next: emp => {
        this.loading = false;
        this.success = `Employee "${emp.firstName}" (ID: ${emp.employeeId}) created successfully!`;
        setTimeout(() => this.router.navigate(['/employees']), 1500);
      },
      error: err => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to create employee.';
      }
    });
  }
}

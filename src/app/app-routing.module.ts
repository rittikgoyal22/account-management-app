import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { ChangeGradeComponent } from './components/change-grade/change-grade.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  {
    path: 'employees',
    component: EmployeeListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['HR'] }
  },
  {
    path: 'employees/add',
    component: AddEmployeeComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['HR'] }
  },
  {
    path: 'employees/:id/change-grade',
    component: ChangeGradeComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['HR'] }
  },
  { path: '**', redirectTo: 'employees' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

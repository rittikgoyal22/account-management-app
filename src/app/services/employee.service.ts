import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { EmployeeRequestDTO, EmployeeResponseDTO } from '../models/employee.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private baseUrl = `${environment.accountManagementUrl}/api/employees`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<EmployeeResponseDTO[]> {
    return this.http.get<EmployeeResponseDTO[]>(this.baseUrl);
  }

  getById(id: number): Observable<EmployeeResponseDTO> {
    return this.http.get<EmployeeResponseDTO>(`${this.baseUrl}/${id}`);
  }

  create(dto: EmployeeRequestDTO): Observable<EmployeeResponseDTO> {
    return this.http.post<EmployeeResponseDTO>(this.baseUrl, dto);
  }

  update(id: number, dto: EmployeeRequestDTO): Observable<EmployeeResponseDTO> {
    return this.http.put<EmployeeResponseDTO>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /** Fetch all employees with the given role. */
  getByRole(role: string): Observable<EmployeeResponseDTO[]> {
    return this.getAll().pipe(
      map(list => list.filter(e => e.role === role))
    );
  }

  /** Find the logged-in user's employee record by email from localStorage. */
  getCurrentEmployee(): Observable<EmployeeResponseDTO> {
    const email = localStorage.getItem('etd_email') ?? '';
    return this.getAll().pipe(
      map(list => {
        const found = list.find(e => e.emailAddress === email);
        if (!found) throw new Error('Current user not found in employee list');
        return found;
      })
    );
  }
}

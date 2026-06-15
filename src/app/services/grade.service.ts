import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GradeResponseDTO } from '../models/grade.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GradeService {
  private baseUrl = `${environment.accountManagementUrl}/api/grades`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<GradeResponseDTO[]> {
    return this.http.get<GradeResponseDTO[]>(this.baseUrl);
  }
}

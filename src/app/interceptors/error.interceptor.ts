import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler,
  HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { APP_URLS } from '../config/app-urls.config';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          localStorage.removeItem('etd_token');
          localStorage.removeItem('etd_refresh_token');
          localStorage.removeItem('etd_role');
          localStorage.removeItem('etd_email');
          window.location.href = `${APP_URLS.auth}/login?logout=true`;
        }
        return throwError(() => error);
      })
    );
  }
}

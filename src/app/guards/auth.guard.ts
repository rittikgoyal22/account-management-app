import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { APP_URLS } from '../config/app-urls.config';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  canActivate(): boolean {
    const token = localStorage.getItem('etd_token');

    if (!token) {
      window.location.href = `${APP_URLS.auth}/login`;
      return false;
    }

    try {
      const base64 = token.split('.')[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));

      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('etd_token');
        localStorage.removeItem('etd_refresh_token');
        localStorage.removeItem('etd_role');
        localStorage.removeItem('etd_email');
        window.location.href = `${APP_URLS.auth}/login`;
        return false;
      }

      return true;
    } catch {
      window.location.href = `${APP_URLS.auth}/login`;
      return false;
    }
  }
}

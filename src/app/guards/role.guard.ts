import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { APP_URLS } from '../config/app-urls.config';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const role = localStorage.getItem('etd_role');
    const allowedRoles = route.data['roles'] as string[] | undefined;

    if (!role || !allowedRoles || !allowedRoles.includes(role)) {
      window.location.href = `${APP_URLS.auth}/login`;
      return false;
    }

    return true;
  }
}

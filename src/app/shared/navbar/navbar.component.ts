import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { APP_URLS, NAV_ITEMS, NavItem } from '../../config/app-urls.config';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  email = '';
  role  = '';
  appUrls = APP_URLS;
  navItems: NavItem[] = [];
  currentPath = '';

  constructor(private http: HttpClient, private router: Router) {
    // Keep the active-tab highlight in sync with SPA navigation.
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.currentPath = window.location.pathname);
  }

  ngOnInit(): void {
    this.email = localStorage.getItem('etd_email') ?? '';
    this.role  = localStorage.getItem('etd_role')  ?? '';
    this.navItems = NAV_ITEMS[this.role] ?? [];
    this.currentPath = window.location.pathname;
  }

  /** True when the item points to a route inside the app that is currently open. */
  private isLocal(item: NavItem): boolean {
    return item.url.startsWith(window.location.origin);
  }

  /** Highlights the tab for the page we are currently on. */
  isActive(item: NavItem): boolean {
    if (!this.isLocal(item)) {
      return false;
    }
    const path = item.url.substring(window.location.origin.length);
    return this.currentPath === path || this.currentPath.startsWith(path + '/');
  }

  /** Same-app links use the SPA router; other apps get a full cross-app redirect. */
  onNavClick(item: NavItem, event: Event): void {
    event.preventDefault();
    if (this.isLocal(item)) {
      this.router.navigateByUrl(item.url.substring(window.location.origin.length));
    } else {
      this.crossAppNavigate(item.url);
    }
  }

  /** Brand click always returns to the unified home page. */
  goHome(event: Event): void {
    event.preventDefault();
    const homeUrl = APP_URLS.travelPlanner + '/home';
    if (homeUrl.startsWith(window.location.origin)) {
      this.router.navigateByUrl('/home');
    } else {
      this.crossAppNavigate(homeUrl);
    }
  }

  logout(): void {
    const token = localStorage.getItem('etd_token');
    if (token) {
      this.http.post(`${environment.authServiceUrl}/auth/logout`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      ).subscribe({ error: () => {} });
    }
    ['etd_token', 'etd_refresh_token', 'etd_role', 'etd_email'].forEach(k => localStorage.removeItem(k));
    window.location.href = `${APP_URLS.auth}/login?logout=true`;
  }

  crossAppNavigate(url: string): void {
    const token        = localStorage.getItem('etd_token') ?? '';
    const refreshToken = localStorage.getItem('etd_refresh_token') ?? '';
    const role         = localStorage.getItem('etd_role') ?? '';
    const email        = localStorage.getItem('etd_email') ?? '';
    const params = new URLSearchParams({ token, refreshToken, role, email });
    window.location.href = `${url}?${params.toString()}`;
  }
}

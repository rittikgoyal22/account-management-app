import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'account-management-app';

  constructor() {
    // localStorage is per-port. When auth-app redirects here with ?token=...
    // we pick up the tokens before any route guards fire.
    const p = new URLSearchParams(window.location.search);
    const token = p.get('token');
    if (token) {
      localStorage.setItem('etd_token', token);
      localStorage.setItem('etd_refresh_token', p.get('refreshToken') ?? '');
      localStorage.setItem('etd_role', p.get('role') ?? '');
      localStorage.setItem('etd_email', p.get('email') ?? '');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }
}

// ─── Cross-App Navigation URLs ────────────────────────────────────────────────
export const APP_URLS = {
  auth:                    'http://localhost:4200',
  accountManagement:       'http://localhost:4201',
  travelPlanner:           'http://localhost:4202',
  reservationManagement:   'http://localhost:4203',
  reimbursementManagement: 'http://localhost:4204'
};

// Role → default landing app after login (all roles land on travel-planner's home page)
export const ROLE_HOME: Record<string, string> = {
  HR:            APP_URLS.travelPlanner,
  Employee:      APP_URLS.travelPlanner,
  TravelDeskExe: APP_URLS.travelPlanner
};

// ─── Shared Navigation Bar Items ──────────────────────────────────────────────
// Single source of truth for the top navbar across ALL micro-frontend apps.
// Every app renders this exact list (keyed by role) so the tabs stay in the same
// place no matter which app is currently open. `url` is the full target URL; the
// navbar uses the SPA router for same-app links and a full cross-app redirect
// (forwarding the JWT) for links that live in another app.
export interface NavItem {
  label: string;
  icon:  string;
  url:   string;
}

export const NAV_ITEMS: Record<string, NavItem[]> = {
  HR: [
    { label: 'Home',             icon: 'bi-house-fill',    url: APP_URLS.travelPlanner     + '/home' },
    { label: 'Pending Requests', icon: 'bi-clock-history', url: APP_URLS.travelPlanner     + '/requests/pending' },
    { label: 'Employees',        icon: 'bi-people-fill',   url: APP_URLS.accountManagement + '/employees' }
  ],
  Employee: [
    { label: 'Home',            icon: 'bi-house-fill',     url: APP_URLS.travelPlanner           + '/home' },
    { label: 'New Request',     icon: 'bi-plus-circle',    url: APP_URLS.travelPlanner           + '/requests/new' },
    { label: 'My Requests',     icon: 'bi-list-check',     url: APP_URLS.travelPlanner           + '/requests/my' },
    { label: 'My Reservations', icon: 'bi-calendar-check', url: APP_URLS.reservationManagement   + '/reservations/track' },
    { label: 'My Claims',       icon: 'bi-receipt',        url: APP_URLS.reimbursementManagement + '/reimbursements/my' }
  ],
  TravelDeskExe: [
    { label: 'Home',             icon: 'bi-house-fill',          url: APP_URLS.travelPlanner           + '/home' },
    { label: 'Add Reservation',  icon: 'bi-calendar-plus',       url: APP_URLS.reservationManagement   + '/reservations/add' },
    { label: 'View Reservations', icon: 'bi-calendar-check',     url: APP_URLS.reservationManagement   + '/reservations/view' },
    { label: 'Process Claims',   icon: 'bi-gear-wide-connected', url: APP_URLS.reimbursementManagement + '/reimbursements' }
  ]
};

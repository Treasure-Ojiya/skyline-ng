import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard-guard';

export const routes: Routes = [
  {
    path: 'application',
    loadComponent: () => import('./layout/application/application').then((m) => m.Application),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      {
        path: 'home',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
      },

      {
        path: 'about',
        loadComponent: () => import('./pages/about/about').then((m) => m.About),
      },

      {
        path: 'contact',
        loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
      },

      {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin/admin').then((m) => m.Admin),
      },

      {
        path: 'flight',
        loadComponent: () => import('./pages/flight/flight').then((m) => m.Flight),
        canActivate: [AuthGuard],
      },

      {
        path: 'booking/:flightId',
        loadComponent: () => import('./pages/booking/booking').then((m) => m.Booking),
        canActivate: [AuthGuard],
      },

      {
        path: 'airports',
        loadComponent: () => import('./pages/airports/airports').then((m) => m.Airports),
        canActivate: [AuthGuard],
      },
    ],
  },

  {
    path: 'public',
    loadComponent: () => import('./layout/public/public').then((m) => m.Public),
    children: [
      {
        path: 'authentication',
        loadComponent: () =>
          import('./pages/authentication/authentication').then((m) => m.Authentication),
      },
    ],
  },
];

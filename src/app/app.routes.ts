import {Routes} from '@angular/router';
import {authGuard} from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component').then((m) => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'register-company',
    loadComponent: () =>
      import('./pages/register-company/register-company.component').then((m) => m.RegisterCompanyComponent)
  },
  {
    path: 'register-employee',
    loadComponent: () =>
      import('./pages/register-employee/register-employee.component').then((m) => m.RegisterEmployeeComponent)
  },
  {
    path: 'waiting',
    loadComponent: () => import('./pages/waiting/waiting.component').then((m) => m.WaitingComponent)
  },
  {
    path: 'app',
    loadComponent: () =>
      import('./layouts/authenticated-layout/authenticated-layout.component').then((m) => m.AuthenticatedLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'onboarding',
        loadComponent: () =>
          import('./pages/onboarding/onboarding.component').then((m) => m.OnboardingComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent)
      },
      {
        path: 'ressources-humaines',
        loadComponent: () =>
          import('./pages/human-resources/human-resources.component').then((m) => m.HumanResourcesComponent)
      },
      {
        path: 'gestion-manager',
        loadComponent: () =>
          import('./pages/gestion-manager/gestion-manager.component').then((m) => m.GestionManagerComponent)
      },
      {
        path: 'gestion-projet',
        loadComponent: () =>
          import('./pages/gestion-projet/gestion-projet.component').then((m) => m.GestionProjetComponent)
      },
      {
        path: 'pointage',
        loadComponent: () =>
          import('./pages/pointage/pointage.component').then((m) => m.PointageComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {path: '**', redirectTo: '', pathMatch: 'full'}
];

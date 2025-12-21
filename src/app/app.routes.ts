import {Routes} from '@angular/router';
import {LandingComponent} from './pages/landing/landing.component';
import {LoginComponent} from './pages/login/login.component';
import {RegisterCompanyComponent} from './pages/register-company/register-company.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {AuthGuard} from './guards/auth.guard';

export const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register-company', component: RegisterCompanyComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: '', pathMatch: 'full'}
];

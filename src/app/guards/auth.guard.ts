import {Injectable} from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';
import {AuthStore} from '../Stores/auth.store';

@Injectable({
              providedIn: 'root'
            })
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authStore: AuthStore,
    private readonly router: Router
  ) {}

  async canActivate(): Promise<boolean | UrlTree> {
    await this.authStore.waitForAuthState();
    if (this.authStore.isAuthenticated()) {
      return true;
    }
    return this.router.createUrlTree(['/login']);
  }
}

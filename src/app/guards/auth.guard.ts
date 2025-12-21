import {inject} from '@angular/core';
import {CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {RoleType} from '../Models';
import {CompanyMembershipService} from '../Services/company-membership.service';
import {OnboardingService} from '../Services/onboarding.service';
import {AuthStore} from '../Stores/auth.store';

export const authGuard: CanActivateFn = async (_route, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const authStore = inject(AuthStore);
  const onboardingService = inject(OnboardingService);
  const membershipService = inject(CompanyMembershipService);

  await authStore.waitForAuthState();
  const user = authStore.user();
  if (!user) {
    return router.createUrlTree(['/login']);
  }

  if (!user.emailVerified) {
    await authStore.signOut();
    return router.createUrlTree(['/login']);
  }

  const hasProfile = await onboardingService.hasProfile(user.uid);
  const membership = hasProfile ? undefined : await membershipService.findMembershipByEmployee(user.uid);
  const hasMembership = hasProfile || !!membership;
  const normalizedUrl = state.url ?? '';
  const isOnboardingRoute = normalizedUrl.startsWith('/onboarding');
  const isDashboardRoute = normalizedUrl.startsWith('/dashboard');
  const isHrRoute = normalizedUrl.startsWith('/ressources-humaines');
  const userRole = hasProfile ? RoleType.ADMIN : (membership?.role ?? RoleType.EMPLOYEE);
  const isHrOrAdmin = userRole === RoleType.HR || userRole === RoleType.ADMIN;

  if (isOnboardingRoute && (hasProfile || hasMembership)) {
    return router.createUrlTree(['/dashboard']);
  }

  if (!isOnboardingRoute && !(hasProfile || hasMembership)) {
    return router.createUrlTree(['/onboarding']);
  }

  if (isHrRoute && !isHrOrAdmin) {
    return router.createUrlTree(['/dashboard']);
  }

  if (isDashboardRoute && isHrOrAdmin) {
    return router.createUrlTree(['/ressources-humaines']);
  }

  return true;
};

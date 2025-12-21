import {inject} from '@angular/core';
import {CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';

export const authGuard: CanActivateFn = async (_route, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const {AuthStore} = await import('../Stores/auth.store');
  const {OnboardingService} = await import('../Services/onboarding.service');
  const authStore = inject(AuthStore);
  const onboardingService = inject(OnboardingService);

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
  const isOnboardingRoute = state.url.startsWith('/onboarding');

  if (isOnboardingRoute && hasProfile) {
    return router.createUrlTree(['/dashboard']);
  }

  if (!isOnboardingRoute && !hasProfile) {
    return router.createUrlTree(['/onboarding']);
  }

  return true;
};

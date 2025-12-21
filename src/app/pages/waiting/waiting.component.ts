import {CommonModule} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonRow,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import type {User} from 'firebase/auth';
import {AuthService} from '../../Services/auth.service';
import {CompanyMembershipService} from '../../Services/company-membership.service';

@Component({
             selector: 'snap-waiting',
             standalone: true,
             imports: [
               CommonModule,
               RouterModule,
               IonContent,
               IonHeader,
               IonToolbar,
               IonTitle,
               IonGrid,
               IonRow,
               IonCol,
               IonCard,
               IonCardHeader,
               IonCardTitle,
               IonCardContent,
               IonText,
               IonButton,
               IonSpinner
             ],
             templateUrl: './waiting.component.html',
             styleUrls: ['./waiting.component.scss']
           })
export class WaitingComponent implements OnInit, OnDestroy {
  userEmail = 'votre adresse e-mail';
  errorMessage?: string;
  private pendingInviteId?: string;

  private intervalId?: number;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly membershipService: CompanyMembershipService
  ) {}

  async ngOnInit() {
    this.pendingInviteId = this.route.snapshot.queryParamMap.get('inviteId') ?? undefined;
    const user = await this.waitForSignedInUser();
    if (!user) {
      void this.router.navigateByUrl('/login');
      return;
    }

    this.userEmail = user.email ?? this.userEmail;
    await this.checkEmailVerification();
    this.startPolling();
  }

  ngOnDestroy() {
    this.stopPolling();
  }

  manualRefresh() {
    void this.checkEmailVerification();
  }

  goToLanding() {
    void this.router.navigateByUrl('/');
  }

  private startPolling() {
    this.stopPolling();
    this.intervalId = window.setInterval(() => void this.checkEmailVerification(), 4000);
  }

  private stopPolling() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private async checkEmailVerification() {
    this.errorMessage = undefined;
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.stopPolling();
      void this.router.navigateByUrl('/login');
      return;
    }

    try {
      await this.authService.reloadCurrentUser();
    } catch {
      this.errorMessage = 'Impossible de mettre à jour l’état du compte pour le moment.';
      return;
    }

    const verifiedUser = this.authService.getCurrentUser();
    if (verifiedUser?.email) {
      this.userEmail = verifiedUser.email;
    }

    if (verifiedUser?.emailVerified) {
      this.stopPolling();
      try {
        await this.membershipService.activateInvite(
          this.pendingInviteId ?? null,
          verifiedUser.uid,
          verifiedUser.email ?? undefined
        );
      } catch {
        // ignore membership errors; allow navigation regardless
      }
      void this.router.navigateByUrl('/dashboard');
    }
  }

  private waitForSignedInUser(): Promise<User | null> {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      return Promise.resolve(currentUser);
    }

    return new Promise(resolve => {
      const unsubscribe = this.authService.observeAuthState(user => {
        if (user) {
          unsubscribe();
          resolve(user);
        }
      });
      setTimeout(() => {
        unsubscribe();
        resolve(null);
      }, 5000);
    });
  }
}

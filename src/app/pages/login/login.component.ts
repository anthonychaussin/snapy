import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {OnboardingService} from '../../Services/onboarding.service';
import {AuthStore} from '../../Stores/auth.store';

@Component({
             selector: 'snap-login-page',
             standalone: true,
             imports: [
               CommonModule,
               RouterModule,
               ReactiveFormsModule,
               IonContent,
               IonHeader,
               IonToolbar,
               IonTitle,
               IonButtons,
               IonBadge,
               IonCard,
               IonCardHeader,
               IonCardTitle,
               IonCardSubtitle,
               IonCardContent,
               IonGrid,
               IonRow,
               IonCol,
               IonList,
               IonItem,
               IonLabel,
               IonInput,
               IonNote,
               IonButton,
               IonText
             ],
             templateUrl: './login.component.html'
           })
export class LoginComponent {
  readonly form: FormGroup;
  manualError?: string;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authStore: AuthStore,
    private readonly router: Router,
    private readonly onboardingService: OnboardingService
  ) {
    this.form = this.fb.group({
                                email: ['', [Validators.required, Validators.email]],
                                password: ['', Validators.required]
                              });
  }

  get error() {
    return this.authStore.error;
  }

  get isLoading() {
    return this.authStore.isLoading();
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const {email, password} = this.form.value;

    try {
      this.manualError = undefined;
      const credential = await this.authStore.signIn(email ?? '', password ?? '');
      const user = credential.user;
      if (!user.emailVerified) {
        await this.authStore.signOut();
        this.manualError = 'Merci de confirmer votre adresse email avant de vous connecter.';
        return;
      }

      const isOnboarded = await this.onboardingService.hasProfile(user.uid);
      const targetRoute = isOnboarded ? '/dashboard' : '/onboarding';
      await this.router.navigateByUrl(targetRoute);
    } catch {
      // Error surfaced via store signal; no additional logic needed.
    }
  }
}

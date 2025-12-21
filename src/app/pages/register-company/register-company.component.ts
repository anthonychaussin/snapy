import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {IonButton, IonContent, IonInput} from '@ionic/angular/standalone';
import {LandingCompanyPayload, LandingSignupService} from '../../Services/landing-signup.service';
import {AuthStore} from '../../Stores/auth.store';

type RegistrationState = 'idle' | 'pending' | 'success' | 'error';

@Component({
             selector: 'snap-register-company',
             imports: [CommonModule, RouterModule, ReactiveFormsModule, IonContent, IonButton, IonInput],
             templateUrl: './register-company.component.html',
             styleUrls: ['./register-company.component.scss']
           })
export class RegisterCompanyComponent {
  readonly form: FormGroup;

  get error() {
    return this.authStore.error;
  }

  registrationState: RegistrationState = 'idle';
  successMessage?: string;
  lastSubmittedAt?: Date;
  lastPayload?: LandingCompanyPayload;
  resendCount = 0;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authStore: AuthStore,
    private readonly companyService: LandingSignupService,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
                                companyName: ['', Validators.required],
                                email: ['', [Validators.required, Validators.email]],
                                password: ['', Validators.required],
                                confirmPassword: ['', Validators.required],
                                contactPhone: ['']
                              });
  }

  get isLoading() {
    return this.authStore.isLoading();
  }

  get isProcessing() {
    return this.registrationState === 'pending';
  }

  get passwordMismatch() {
    const password = this.form.get('password')?.value;
    const confirm = this.form.get('confirmPassword')?.value;
    return !!password && !!confirm && password !== confirm;
  }

  async submit() {
    if (this.registrationState === 'pending') {
      return;
    }

    if (this.form.invalid || this.passwordMismatch) {
      this.form.markAllAsTouched();
      return;
    }

    const {companyName, email, password, contactPhone} = this.form.value;
    this.registrationState = 'pending';
    this.successMessage = undefined;

    try {
      const credential = await this.authStore.register(email ?? '', password ?? '');
      const payload = this.buildPayload(
        credential.user.uid,
        1,
        companyName ?? undefined,
        email ?? undefined,
        contactPhone ?? undefined
      );
      await this.companyService.registerLandingCompany(payload);
      this.resendCount = 0;
      this.handleSuccess(
        payload,
        'Nous avons bien reçu votre demande, vous recevrez une confirmation par email.',
        true
      );
    } catch {
      this.registrationState = 'error';
    }
  }

  async resend() {
    if (this.registrationState === 'pending' || !this.lastPayload) {
      return;
    }

    this.registrationState = 'pending';

    try {
      const attempt = this.resendCount + 2;
      const payload: LandingCompanyPayload = {
        ...this.lastPayload,
        notes: `Renvoi (${attempt}) depuis la landing page`
      };

      await this.companyService.registerLandingCompany(payload);
      this.resendCount++;
      this.handleSuccess(
        payload,
        `Demande renvoyée (tentative ${attempt}). Elle reste en cours de validation.`,
        false
      );
    } catch {
      this.registrationState = 'error';
    }
  }

  goToDashboard() {
    void this.router.navigateByUrl('/dashboard');
  }

  private buildPayload(
    ownerUid: string,
    attempt: number,
    companyName?: string,
    contactEmail?: string,
    contactPhone?: string
  ): LandingCompanyPayload {
    return {
      ownerUid,
      companyName: companyName ?? '',
      contactEmail: contactEmail ?? '',
      contactPhone: contactPhone ?? undefined,
      notes:
        attempt === 1
        ? 'Inscription initiale depuis la landing page'
        : `Tentative (${attempt}) depuis la landing page`
    };
  }

  private handleSuccess(payload: LandingCompanyPayload, message: string, resetResend = false) {
    this.lastPayload = payload;
    if (resetResend) {
      this.resendCount = 0;
    }
    this.lastSubmittedAt = new Date();
    this.successMessage = message;
    this.registrationState = 'success';
  }
}

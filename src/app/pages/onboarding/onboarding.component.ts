import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {
  IonButton,
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
  IonTextarea,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {OnboardingService} from '../../Services/onboarding.service';
import {AuthStore} from '../../Stores/auth.store';

type OnboardingState = 'idle' | 'pending' | 'error';

@Component({
             selector: 'snap-onboarding-page',
             standalone: true,
             imports: [
               CommonModule,
               RouterModule,
               ReactiveFormsModule,
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
               IonCardSubtitle,
               IonCardContent,
               IonList,
               IonItem,
               IonLabel,
               IonInput,
               IonTextarea,
               IonButton,
               IonText,
               IonNote
             ],
             templateUrl: './onboarding.component.html'
           })
export class OnboardingComponent {
  readonly form: FormGroup;
  state: OnboardingState = 'idle';

  constructor(
    private readonly fb: FormBuilder,
    private readonly authStore: AuthStore,
    private readonly onboardingService: OnboardingService,
    private readonly router: Router
  ) {
    const user = this.authStore.user();
    this.form = this.fb.group({
                                companyName: [user?.displayName ?? '', Validators.required],
                                industry: ['', Validators.required],
                                contactPhone: [''],
                                officeLocation: [''],
                                description: ['']
                              });
  }

  get userEmail() {
    return this.authStore.user()?.email ?? '';
  }

  get isProcessing() {
    return this.state === 'pending';
  }

  async submit() {
    if (this.isProcessing) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.authStore.user();
    if (!user) {
      return;
    }

    this.state = 'pending';

    try {
      await this.onboardingService.saveProfile({
                                                 ownerUid: user.uid,
                                                 companyName: this.form.get('companyName')?.value ?? '',
                                                 industry: this.form.get('industry')?.value ?? '',
                                                 contactEmail: this.userEmail,
                                                 contactPhone: this.form.get('contactPhone')?.value ?? undefined,
                                                 officeLocation: this.form.get('officeLocation')?.value ?? undefined,
                                                 description: this.form.get('description')?.value ?? undefined
                                               });
      await this.router.navigateByUrl('/dashboard');
    } catch {
      this.state = 'error';
    }
  }
}

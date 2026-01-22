import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {
  IonBadge,
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
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {AuthService} from '../../Services/auth.service';
import {AuthStore} from '../../Stores/auth.store';

type RegistrationState = 'idle' | 'pending' | 'success' | 'error';

@Component({
             selector: 'snap-register-company',
             standalone: true,
             imports: [
               CommonModule,
               RouterModule,
               ReactiveFormsModule,
               IonContent,
               IonHeader,
               IonToolbar,
               IonTitle,
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
               IonButton,
               IonText,
               IonNote
             ],
             templateUrl: './register-company.component.html'
           })
export class RegisterCompanyComponent {
  readonly form: FormGroup;
  registrationState: RegistrationState = 'idle';
  successMessage?: string;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authStore: AuthStore,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly alertController: AlertController
  ) {
    this.form = this.fb.group({
                                companyName: ['', Validators.required],
                                email: ['', [Validators.required, Validators.email]],
                                password: ['', Validators.required],
                                confirmPassword: ['', Validators.required]
                              });
  }

  get error() {
    return this.authStore.error;
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
      this.registrationState = 'idle';
      return;
    }

    const {companyName, email, password} = this.form.value;
    this.registrationState = 'pending';
    this.successMessage = undefined;

    try {
      const credential = await this.authStore.register(email ?? '', password ?? '');
      if (companyName) {
        await this.authService.updateDisplayName(credential.user, companyName);
      }
      await this.authService.sendVerificationEmail(credential.user);
      this.successMessage =
        'Votre compte est créé, un e-mail de confirmation vient de vous être envoyé. Merci de vérifier votre boîte mail avant de vous connecter.';
      this.registrationState = 'success';
      await this.presentVerificationAlert(email ?? '');
    } catch {
      this.registrationState = 'error';
    }
  }

  goToLogin() {
    void this.router.navigateByUrl('/login');
  }

  goToWaiting() {
    void this.router.navigateByUrl('/waiting');
  }

  private async presentVerificationAlert(email: string) {
    const alert = await this.alertController.create({
                                                      header: 'Confirmez votre adresse e-mail',
                                                      message: `Un e-mail de confirmation vient d'être envoyé à ${email || 'votre adresse e-mail'}. Merci de cliquer sur le lien avant d'accéder à l'application.`,
                                                      backdropDismiss: false,
                                                      buttons: [
                                                        {
                                                          text: 'Retour à la landing',
                                                          role: 'cancel',
                                                          handler: () => {
                                                            void this.router.navigateByUrl('/');
                                                          }
                                                        },
                                                        {
                                                          text: 'Aller à la page d\'attente',
                                                          handler: () => {
                                                            void this.router.navigateByUrl('/waiting');
                                                          }
                                                        }
                                                      ]
                                                    });

    await alert.present();
  }
}

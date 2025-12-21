import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
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
import {CompanyMembership, CompanyMembershipService} from '../../Services/company-membership.service';
import {AuthStore} from '../../Stores/auth.store';

type RegistrationState = 'idle' | 'pending' | 'success' | 'error';

@Component({
             selector: 'snap-register-employee',
             standalone: true,
             imports: [
               CommonModule,
               RouterModule,
               ReactiveFormsModule,
               IonContent,
               IonHeader,
               IonTitle,
               IonToolbar,
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
               IonButton,
               IonBadge,
               IonText,
               IonNote
             ],
             templateUrl: './register-employee.component.html'
           })
export class RegisterEmployeeComponent implements OnInit {
  readonly form: FormGroup;
  registrationState: RegistrationState = 'idle';
  inviteId?: string;
  invite?: CompanyMembership;
  invitationError?: string;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authStore: AuthStore,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly alertController: AlertController,
    private readonly membershipService: CompanyMembershipService
  ) {
    this.form = this.fb.group({
                                firstName: ['', Validators.required],
                                lastName: ['', Validators.required],
                                email: ['', [Validators.required, Validators.email]],
                                password: ['', Validators.required],
                                confirmPassword: ['', Validators.required]
                              });
    this.inviteId = this.route.snapshot.queryParamMap.get('inviteId') ?? undefined;
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

  ngOnInit() {
    if (this.inviteId) {
      void this.loadInvite();
    }
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

    const firstName = this.form.get('firstName')?.value ?? '';
    const lastName = this.form.get('lastName')?.value ?? '';
    const email = (this.form.get('email')?.value ?? '').trim().toLowerCase();
    const password = this.form.get('password')?.value ?? '';

    this.registrationState = 'pending';
    this.invitationError = undefined;

    try {
      await this.ensureInvite(email);
      const credential = await this.authStore.register(email, password);
      const displayName = `${firstName} ${lastName}`.trim();
      if (displayName) {
        await this.authService.updateDisplayName(credential.user, displayName);
      }
      await this.authService.sendVerificationEmail(credential.user);
      this.registrationState = 'success';
      await this.presentVerificationAlert(email);
    } catch (error) {
      if (error instanceof Error && error.message) {
        this.invitationError = error.message;
      }
      this.registrationState = 'error';
    }
  }

  goToLogin() {
    void this.router.navigateByUrl('/login');
  }

  private async loadInvite() {
    const invite = await this.membershipService.getInviteById(this.inviteId ?? '');
    if (invite) {
      this.invite = invite;
      this.form.get('email')?.setValue(invite.email);
    } else {
      this.invitationError = 'Ce lien d’invitation n’est pas valide. Demandez à votre responsable de vous le renvoyer.';
    }
  }

  private async ensureInvite(email: string): Promise<CompanyMembership> {
    if (this.invite) {
      return this.invite;
    }

    if (this.inviteId) {
      const invite = await this.membershipService.getInviteById(this.inviteId);
      if (invite) {
        this.invite = invite;
        this.form.get('email')?.setValue(invite.email);
        return invite;
      }
    }

    const pendingInvite = await this.membershipService.findPendingByEmail(email);
    if (!pendingInvite) {
      throw new Error(
        'Nous n’avons trouvé aucune invitation associée à cette adresse. Demandez à votre responsable de vous renvoyer un lien d’inscription.'
      );
    }

    this.invite = pendingInvite;
    this.form.get('email')?.setValue(pendingInvite.email);
    return pendingInvite;
  }

  private async presentVerificationAlert(email: string) {
    const queryParam = this.invite?.id ? `?inviteId=${this.invite.id}` : '';
    const alert = await this.alertController.create({
                                                      header: 'Confirmez votre adresse e-mail',
                                                      message: `Un e-mail de confirmation vient d’être envoyé à ${email}. Merci de cliquer sur le lien avant de vous connecter.`,
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
                                                          text: 'Aller à la page d’attente',
                                                          handler: () => {
                                                            void this.router.navigateByUrl(`/waiting${queryParam}`);
                                                          }
                                                        }
                                                      ]
                                                    });
    await alert.present();
  }
}

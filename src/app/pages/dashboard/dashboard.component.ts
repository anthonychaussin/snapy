import {Component, computed, OnDestroy, OnInit, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
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
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea
} from '@ionic/angular/standalone';
import {RoleType} from '../../Models';
import {CompanyMembership, CompanyMembershipService} from '../../Services/company-membership.service';
import {OnboardingService} from '../../Services/onboarding.service';
import {AuthStore} from '../../Stores/auth.store';
import {CompanyStore} from '../../Stores/company.store';
import {ProjectStore} from '../../Stores/project.store';
import {TaskStore} from '../../Stores/task.store';

@Component({
             selector: 'snap-dashboard-page',
             standalone: true,
             imports: [
               ReactiveFormsModule,
               IonContent,
               IonGrid,
               IonRow,
               IonCol,
               IonCard,
               IonCardHeader,
               IonCardTitle,
               IonCardSubtitle,
               IonCardContent,
               IonButton,
               IonList,
               IonItem,
               IonLabel,
               IonText,
               IonInput,
               IonSelect,
               IonSelectOption,
               IonTextarea
             ],
             templateUrl: './dashboard.component.html'
           })
export class DashboardComponent implements OnInit, OnDestroy {
  readonly companyCount = computed(() => this.companyStore.entityCount());
  readonly projectCount = computed(() => this.projectStore.entityCount());
  readonly missionCount = computed(() => this.taskStore.entityCount());
  readonly recentProjects = computed(() => this.projectStore.entities().slice(0, 3));
  readonly recentMissions = computed(() => this.taskStore.entities().slice(0, 3));

  readonly inviteForm = this.fb.group({
                                        email: ['', [Validators.required, Validators.email]],
                                        role: [RoleType.EMPLOYEE, Validators.required]
                                      });
  inviteMessage?: string;
  inviteError?: string;
  inviteProcessing = false;
  readonly roleOptions = [
    {label: 'Admin', value: RoleType.ADMIN},
    {label: 'RH', value: RoleType.HR},
    {label: 'Project Manager', value: RoleType.MANAGER},
    {label: 'Employé', value: RoleType.EMPLOYEE}
  ];

  private readonly membershipsSignal = signal<CompanyMembership[]>([]);
  readonly activeMembers = computed(() => this.membershipsSignal().filter(member => member.status === 'active'));
  readonly pendingInvites = computed(() => this.membershipsSignal().filter(member => member.status === 'pending'));
  readonly companyForm = this.fb.group({
                                         companyName: ['', Validators.required],
                                         industry: [''],
                                         contactPhone: [''],
                                         officeLocation: [''],
                                         description: ['']
                                       });
  companyMessage?: string;
  companyError?: string;
  companySaving = false;

  private ownerId?: string;
  private membershipUnsubscribe?: () => void;

  constructor(
    public readonly authStore: AuthStore,
    private readonly companyStore: CompanyStore,
    private readonly projectStore: ProjectStore,
    private readonly taskStore: TaskStore,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly membershipService: CompanyMembershipService,
    private readonly onboardingService: OnboardingService
  ) {}

  ngOnInit() {
    void this.initializeCompanyContext();
  }

  ngOnDestroy() {
    this.membershipUnsubscribe?.();
  }

  async inviteEmployee() {
    if (this.inviteForm.invalid) {
      this.inviteForm.markAllAsTouched();
      return;
    }

    if (!this.ownerId) {
      this.inviteError = 'Impossible de créer une invitation pour le moment.';
      return;
    }

    const email = (this.inviteForm.get('email')?.value ?? '').trim().toLowerCase();
    const role = this.inviteForm.get('role')?.value ?? RoleType.EMPLOYEE;
    this.inviteProcessing = true;
    this.inviteMessage = undefined;
    this.inviteError = undefined;

    try {
      const invite = await this.membershipService.invite(email, this.ownerId, role);
      this.inviteForm.reset({role: RoleType.EMPLOYEE});
      this.inviteMessage = `Invitation créée pour ${invite.email}. Partagez ${this.buildInviteLink(invite.id)}.`;
    } catch {
      this.inviteError = 'Une erreur est survenue lors de la création de l’invitation.';
    } finally {
      this.inviteProcessing = false;
    }
  }

  async saveCompanyDetails() {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }

    const user = this.authStore.user();
    if (!user) {
      return;
    }

    this.companySaving = true;
    this.companyMessage = undefined;
    this.companyError = undefined;

    try {
      await this.onboardingService.updateProfile({
                                                   ownerUid: user.uid,
                                                   companyName: this.companyForm.get('companyName')?.value ?? '',
                                                   industry: this.companyForm.get('industry')?.value ?? undefined,
                                                   contactPhone: this.companyForm.get('contactPhone')?.value ?? undefined,
                                                   officeLocation: this.companyForm.get('officeLocation')?.value ?? undefined,
                                                   description: this.companyForm.get('description')?.value ?? undefined,
                                                   contactEmail: user.email ?? undefined
                                                 });
      this.companyMessage = 'Informations enregistrées.';
    } catch {
      this.companyError = 'Impossible d’enregistrer les détails de l’entreprise pour le moment.';
    } finally {
      this.companySaving = false;
    }
  }

  getRoleLabel(role?: RoleType) {
    const option = this.roleOptions.find(r => r.value === role);
    return option?.label ?? 'Employé';
  }

  async updateMemberRole(member: CompanyMembership, role?: RoleType) {
    if (!member.id || member.role === role) {
      return;
    }
    try {
      await this.membershipService.updateMemberRole(member.id, role);
    } catch {
      this.inviteError = 'Impossible de changer le rôle pour le moment.';
    }
  }

  async logout() {
    await this.authStore.signOut();
    await this.router.navigateByUrl('/login');
  }

  buildInviteLink(inviteId?: string) {
    const suffix = inviteId ? `?inviteId=${inviteId}` : '';
    return `${window.location.origin}/register-employee${suffix}`;
  }

  private async initializeCompanyContext() {
    const user = this.authStore.user();
    if (!user) {
      return;
    }

    const hasProfile = await this.onboardingService.hasProfile(user.uid);
    this.ownerId = hasProfile ? user.uid : undefined;
    if (hasProfile) {
      const profile = await this.onboardingService.getProfile(user.uid);
      if (profile) {
        this.companyForm.patchValue({
                                      companyName: profile.companyName ?? '',
                                      industry: profile.industry ?? '',
                                      contactPhone: profile.contactPhone ?? '',
                                      officeLocation: profile.officeLocation ?? '',
                                      description: profile.description ?? ''
                                    });
      }
    }

    if (!this.ownerId) {
      const membership = await this.membershipService.findMembershipByEmployee(user.uid);
      this.ownerId = membership?.ownerUid ?? undefined;
    }

    if (this.ownerId) {
      this.membershipUnsubscribe = this.membershipService.subscribeToOwner(this.ownerId, members => {
        this.membershipsSignal.set(members ?? []);
      });
    }
  }
}

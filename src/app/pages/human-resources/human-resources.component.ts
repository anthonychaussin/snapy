import {CommonModule} from '@angular/common';
import {Component, computed, OnDestroy, OnInit, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
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
  IonProgressBar,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {RoleType} from '../../Models';
import {CompanyMembership, CompanyMembershipService} from '../../Services/company-membership.service';
import {OnboardingService} from '../../Services/onboarding.service';
import {AuthStore} from '../../Stores/auth.store';

interface HrSettings {
  weeklyTargetHours: number;
  loggedHours: number;
  hourlyRate: number;
  teleworkDays: string[];
  workingDays: string[];
  notes: string;
}

@Component({
             selector: 'snap-human-resources-page',
             standalone: true,
             imports: [
               CommonModule,
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
               IonButton,
               IonSelect,
               IonSelectOption,
               IonTextarea,
               IonProgressBar,
               IonText
             ],
             templateUrl: './human-resources.component.html',
             styles: []
           })
export class HumanResourcesComponent implements OnInit, OnDestroy {
  readonly inviteForm = this.fb.group({
                                        email: ['', [Validators.required, Validators.email]],
                                        role: [RoleType.EMPLOYEE, Validators.required]
                                      });

  inviteMessage?: string;
  inviteError?: string;
  inviteProcessing = false;
  actionMessage?: string;
  actionError?: string;

  readonly roleOptions = [
    {label: 'Admin', value: RoleType.ADMIN},
    {label: 'RH', value: RoleType.HR},
    {label: 'Project Manager', value: RoleType.MANAGER},
    {label: 'Employe', value: RoleType.EMPLOYEE}
  ];

  readonly dayOptions = [
    {label: 'Lundi', value: 'lundi'},
    {label: 'Mardi', value: 'mardi'},
    {label: 'Mercredi', value: 'mercredi'},
    {label: 'Jeudi', value: 'jeudi'},
    {label: 'Vendredi', value: 'vendredi'},
    {label: 'Samedi', value: 'samedi'},
    {label: 'Dimanche', value: 'dimanche'}
  ];

  private readonly membershipsSignal = signal<CompanyMembership[]>([]);
  private readonly settingsSignal = signal(new Map<string, HrSettings>());
  private readonly selectedMemberId = signal<string | null>(null);

  readonly totalMembers = computed(() => this.membershipsSignal().length);
  readonly activeMembers = computed(() => this.membershipsSignal().filter(member => member.status === 'active'));
  readonly pendingInvites = computed(() => this.membershipsSignal().filter(member => member.status === 'pending'));
  readonly selectedMember = computed(() => {
    const members = this.membershipsSignal();
    if (!members.length) {
      return null;
    }
    const selectedId = this.selectedMemberId();
    return members.find(member => member.id === selectedId) ?? members[0];
  });
  readonly selectedSettings = computed(() => {
    const member = this.selectedMember();
    if (!member) {
      return null;
    }
    return this.settingsSignal().get(member.id ?? '') ?? this.createDefaultSettings(member);
  });

  private ownerId?: string;
  private membershipUnsubscribe?: () => void;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authStore: AuthStore,
    private readonly onboardingService: OnboardingService,
    private readonly membershipService: CompanyMembershipService
  ) {}

  ngOnInit() {
    void this.initializeOwnerContext();
  }

  ngOnDestroy() {
    this.membershipUnsubscribe?.();
  }

  async inviteEmployee() {
    if (this.inviteForm.invalid) {
      this.inviteForm.markAllAsTouched();
      return;
    }

    const email = (this.inviteForm.value.email ?? '').trim().toLowerCase();
    const role = (this.inviteForm.value.role ?? RoleType.EMPLOYEE) as RoleType;

    if (!this.ownerId) {
      this.inviteError = 'Impossible de creer une invitation pour le moment.';
      return;
    }

    this.inviteProcessing = true;
    this.inviteMessage = undefined;
    this.inviteError = undefined;

    try {
      const invite = await this.membershipService.invite(email, this.ownerId, role);
      this.inviteForm.reset({role: RoleType.EMPLOYEE});
      this.inviteMessage = `Invitation cree pour ${invite.email}. Partagez ${this.buildInviteLink(invite.id)}.`;
    } catch {
      this.inviteError = 'Une erreur est survenue lors de la creation de l\'invitation.';
    } finally {
      this.inviteProcessing = false;
    }
  }

  async updateMemberRole(member: CompanyMembership, role?: RoleType) {
    if (!member.id || !role || member.role === role) {
      return;
    }
    this.actionMessage = undefined;
    this.actionError = undefined;
    try {
      await this.membershipService.updateMemberRole(member.id, role);
      this.actionMessage = 'Role mis a jour.';
    } catch {
      this.actionError = 'Impossible de mettre a jour le role pour le moment.';
    }
  }

  async removeMember(member: CompanyMembership) {
    if (!member.id) {
      return;
    }
    this.actionMessage = undefined;
    this.actionError = undefined;
    try {
      await this.membershipService.removeMembership(member.id);
      this.actionMessage = `${member.email} a bien ete retire.`;
      if (this.selectedMemberId() === member.id) {
        this.selectedMemberId.set(null);
      }
    } catch {
      this.actionError = 'Impossible de supprimer le collaborateur pour le moment.';
    }
  }

  updateSetting(memberId: string, partial: Partial<HrSettings>) {
    this.settingsSignal.update(current => {
      const copy = new Map(current);
      const currentSettings = copy.get(memberId) ?? this.createDefaultSettings();
      const updated = {...currentSettings, ...partial};
      copy.set(memberId, updated);
      return copy;
    });
  }

  updateNumericSetting(
    memberId: string,
    field: 'weeklyTargetHours' | 'loggedHours' | 'hourlyRate',
    value: string | number | null
  ) {
    const numeric = Number(value ?? 0);
    this.updateSetting(memberId, {[field]: Number.isFinite(numeric) ? numeric : 0});
  }

  updateArraySetting(
    memberId: string,
    field: 'teleworkDays' | 'workingDays',
    values: string | string[] | null
  ) {
    const normalized = Array.isArray(values)
                       ? values
                       : values
                         ? [values]
                         : [];
    this.updateSetting(memberId, {[field]: normalized});
  }

  selectMember(memberId: string | null) {
    this.selectedMemberId.set(memberId);
  }

  getSettings(member: CompanyMembership): HrSettings {
    if (!member.id) {
      return this.createDefaultSettings(member);
    }
    return this.settingsSignal().get(member.id) ?? this.createDefaultSettings(member);
  }

  selectedProgressValue() {
    const settings = this.selectedSettings();
    if (!settings || !settings.weeklyTargetHours) {
      return 0;
    }
    const ratio = settings.loggedHours / Math.max(settings.weeklyTargetHours, 1);
    return Math.min(1, Math.max(0, ratio));
  }

  selectedProgressPercent() {
    return Math.round(this.selectedProgressValue() * 100);
  }

  resetSettings(member: CompanyMembership | null) {
    if (!member?.id) {
      return;
    }
    this.settingsSignal.update(current => {
      const copy = new Map(current);
      copy.set(member.id!, this.createDefaultSettings(member));
      return copy;
    });
  }

  getRoleLabel(role?: RoleType) {
    const option = this.roleOptions.find(r => r.value === role);
    return option?.label ?? 'Employe';
  }

  getProgressValue(member: CompanyMembership) {
    if (!member.id) {
      return 0;
    }
    const data = this.settingsSignal().get(member.id);
    if (!data || !data.weeklyTargetHours) {
      return 0;
    }
    const ratio = data.loggedHours / Math.max(data.weeklyTargetHours, 1);
    return Math.min(1, Math.max(0, ratio));
  }

  getPercentage(member: CompanyMembership) {
    return Math.round(this.getProgressValue(member) * 100);
  }

  private async initializeOwnerContext() {
    const user = this.authStore.user();
    if (!user) {
      return;
    }
    const hasProfile = await this.onboardingService.hasProfile(user.uid);
    this.ownerId = hasProfile ? user.uid : undefined;
    if (!this.ownerId) {
      const membership = await this.membershipService.findMembershipByEmployee(user.uid);
      this.ownerId = membership?.ownerUid;
    }

    if (!this.ownerId) {
      return;
    }

    this.membershipUnsubscribe = this.membershipService.subscribeToOwner(this.ownerId, members => {
      const list = members ?? [];
      this.membershipsSignal.set(list);
      this.ensureSettings(list);
      this.syncSelectedMember(list);
    });
  }

  private syncSelectedMember(list: CompanyMembership[]) {
    const currentId = this.selectedMemberId();
    if (currentId && list.some(member => member.id === currentId)) {
      return;
    }
    const fallback = list.find(member => member.status === 'active') ?? list[0];
    this.selectedMemberId.set(fallback?.id ?? null);
  }

  private ensureSettings(list: CompanyMembership[]) {
    if (!list.length) {
      this.settingsSignal.set(new Map());
      return;
    }
    this.settingsSignal.update(current => {
      const copy = new Map(current);
      list.forEach(member => {
        if (!member.id) {
          return;
        }
        if (!copy.has(member.id)) {
          copy.set(member.id, this.createDefaultSettings(member));
        }
      });
      return copy;
    });
  }

  private createDefaultSettings(member?: CompanyMembership): HrSettings {
    return {
      weeklyTargetHours: 40,
      loggedHours: 0,
      hourlyRate:
        member?.role === RoleType.ADMIN
        ? 45
        : member?.role === RoleType.MANAGER
          ? 40
          : member?.role === RoleType.HR
            ? 38
            : 30,
      teleworkDays: ['mercredi'],
      workingDays: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'],
      notes: ''
    };
  }

  private buildInviteLink(inviteId?: string) {
    const suffix = inviteId ? `?inviteId=${inviteId}` : '';
    return `${window.location.origin}/register-employee${suffix}`;
  }
}

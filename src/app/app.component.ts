import {CommonModule} from '@angular/common';
import {Component, computed, effect, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonRouterOutlet,
  IonText,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {
  businessOutline,
  documentTextOutline,
  layersOutline,
  peopleOutline,
  personCircleOutline,
  pulseOutline,
  timeOutline
} from 'ionicons/icons';
import {RoleType} from './Models';
import {CompanyMembershipService} from './Services/company-membership.service';
import {OnboardingService} from './Services/onboarding.service';
import {AuthStore} from './Stores/auth.store';

interface MenuEntry {
  label: string;
  route: string;
  icon: string;
}

const ROLE_LABELS: Record<RoleType, string> = {
  [RoleType.ADMIN]: 'Administrateur',
  [RoleType.HR]: 'Ressources humaines',
  [RoleType.MANAGER]: 'Chef de projet',
  [RoleType.EMPLOYEE]: 'Employé'
};

const MENU_BY_ROLE: Record<RoleType, MenuEntry[]> = {
  [RoleType.ADMIN]: [
    {label: 'Gestion de l\'entreprise', route: '/dashboard', icon: 'business-outline'},
    {label: 'Gestion RH', route: '/ressources-humaines', icon: 'people-outline'},
    {label: 'Gestion manager', route: '/gestion-manager', icon: 'person-circle-outline'}
  ],
  [RoleType.HR]: [
    {label: 'Gestion RH', route: '/ressources-humaines', icon: 'people-outline'},
    {label: 'Pointage', route: '/pointage', icon: 'time-outline'}
  ],
  [RoleType.MANAGER]: [
    {label: 'Gestion de projet', route: '/gestion-projet', icon: 'layers-outline'},
    {label: 'Pointage', route: '/pointage', icon: 'time-outline'}
  ],
  [RoleType.EMPLOYEE]: [
    {label: 'Pointage', route: '/pointage', icon: 'time-outline'}
  ]
};

@Component({
  selector: 'app-root',
             standalone: true,
             imports: [
               CommonModule,
               IonApp,
               IonRouterOutlet,
               IonMenu,
               IonHeader,
               IonToolbar,
               IonTitle,
               IonContent,
               IonList,
               IonMenuToggle,
               IonItem,
               IonIcon,
               IonLabel,
               RouterLink,
               IonText
             ],
  templateUrl: './app.component.html',
             styleUrls: ['./app.component.scss']
})
export class AppComponent {
  dark = true;
  private readonly menuSignal = signal<MenuEntry[]>([]);
  readonly menuEntries = this.menuSignal.asReadonly();
  private readonly roleSignal = signal<RoleType | undefined>(undefined);
  readonly currentRoleLabel = computed(() => {
    const role = this.roleSignal();
    return role ? ROLE_LABELS[role] : undefined;
  });
  private roleRequestId = 0;

  constructor(
    private readonly authStore: AuthStore,
    private readonly onboardingService: OnboardingService,
    private readonly membershipService: CompanyMembershipService
  ) {
    addIcons({
               'pulse-outline': pulseOutline,
               'document-text-outline': documentTextOutline,
               'people-outline': peopleOutline,
               'business-outline': businessOutline,
               'person-circle-outline': personCircleOutline,
               'layers-outline': layersOutline,
               'time-outline': timeOutline
             });

    effect(() => {
      const user = this.authStore.user();
      if (!user) {
        this.menuSignal.set([]);
        this.roleSignal.set(undefined);
        return;
      }
      void this.refreshMenu(user.uid);
    });
  }

  private async refreshMenu(uid: string) {
    const requestId = ++this.roleRequestId;
    const hasProfile = await this.onboardingService.hasProfile(uid);
    if (requestId !== this.roleRequestId) {
      return;
    }
    if (hasProfile) {
      this.applyRole(RoleType.ADMIN);
      return;
    }

    const membership = await this.membershipService.findMembershipByEmployee(uid);
    if (requestId !== this.roleRequestId) {
      return;
    }
    this.applyRole(membership?.role ?? RoleType.EMPLOYEE);
  }

  private applyRole(role: RoleType) {
    this.roleSignal.set(role);
    this.menuSignal.set(MENU_BY_ROLE[role]);
  }

  rightCLick($event: MouseEvent) {}
}

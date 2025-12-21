import {CommonModule} from '@angular/common';
import {Component, computed} from '@angular/core';
import {Router} from '@angular/router';
import {IonButton, IonContent} from '@ionic/angular/standalone';
import {AuthStore} from '../../Stores/auth.store';
import {CompanyStore} from '../../Stores/company.store';
import {ProjectStore} from '../../Stores/project.store';
import {TaskStore} from '../../Stores/task.store';

@Component({
             selector: 'snap-dashboard-page',
             imports: [CommonModule, IonContent, IonButton],
             templateUrl: './dashboard.component.html',
             styleUrls: ['./dashboard.component.scss']
           })
export class DashboardComponent {
  readonly companyCount = computed(() => this.companyStore.entityCount());
  readonly projectCount = computed(() => this.projectStore.entityCount());
  readonly missionCount = computed(() => this.taskStore.entityCount());
  readonly topCompanies = computed(() => this.companyStore.entities().slice(0, 3));
  readonly recentMissions = computed(() => this.taskStore.entities().slice(0, 3));

  constructor(
    public readonly authStore: AuthStore,
    private readonly companyStore: CompanyStore,
    private readonly projectStore: ProjectStore,
    private readonly taskStore: TaskStore,
    private readonly router: Router
  ) {}

  async logout() {
    await this.authStore.signOut();
    await this.router.navigateByUrl('/login');
  }

}

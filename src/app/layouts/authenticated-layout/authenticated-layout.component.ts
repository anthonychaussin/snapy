import {Component, computed, effect, inject, signal} from '@angular/core';
import {IonApp, IonRouterOutlet} from '@ionic/angular/standalone';
import {MenuLoaderComponent} from '../../components/menu-loader/menu-loader.component';
import {AuthStore} from '../../Stores/auth.store';

@Component({
             selector: 'app-authenticated-layout',
             standalone: true,
             imports: [
               IonApp,
               IonRouterOutlet,
               MenuLoaderComponent
             ],
             template: `
    <ion-app>
      <app-menu-loader />
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-app>
  `
           })
export class AuthenticatedLayoutComponent {
  private readonly authStore = inject(AuthStore);
  private readonly showMenuSignal = signal(false);

  readonly showMenu = computed(() => this.showMenuSignal());

  constructor() {
    effect(() => {
      const user = this.authStore.user();
      this.showMenuSignal.set(!!user);
    });
  }
}


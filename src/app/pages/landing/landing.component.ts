import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';
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
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonProgressBar,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

@Component({
             selector: 'snap-landing-page',
             imports: [
               RouterModule,
               IonContent,
               IonHeader,
               IonToolbar,
               IonTitle,
               IonButtons,
               IonBadge,
               IonButton,
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
               IonIcon,
               IonText,
               IonProgressBar
             ],
             templateUrl: './landing.component.html'
           })
export class LandingComponent {
}

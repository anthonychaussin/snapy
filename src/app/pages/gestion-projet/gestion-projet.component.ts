import {Component} from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonText,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

@Component({
             selector: 'snap-gestion-projet-page',
             standalone: true,
             imports: [
               IonHeader,
               IonToolbar,
               IonTitle,
               IonContent,
               IonCard,
               IonCardHeader,
               IonCardTitle,
               IonCardSubtitle,
               IonCardContent,
               IonText
             ],
             templateUrl: './gestion-projet.component.html'
           })
export class GestionProjetComponent {
}

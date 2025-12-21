import {Component} from '@angular/core';
import {IonApp, IonRouterOutlet} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {documentTextOutline, peopleOutline, pulseOutline} from 'ionicons/icons';

@Component({
  selector: 'app-root',
             standalone: true,
             imports: [
               IonRouterOutlet,
               IonApp],
  templateUrl: './app.component.html',
             styleUrls: ['./app.component.scss']
})
export class AppComponent {
  dark = true;

  constructor() {
    /**
     * Any icons you want to use in your application
     * can be registered in app.component.ts and then
     * referenced by name anywhere in your application.
     */
    addIcons({
               'pulse-outline': pulseOutline,
               'document-text-outline': documentTextOutline,
               'people-outline': peopleOutline
             });
  }

  rightCLick($event: MouseEvent) {
  }
}

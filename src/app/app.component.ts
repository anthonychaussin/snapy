import { Component } from '@angular/core';
import {IonRouterOutlet, IonApp} from '@ionic/angular/standalone';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
             imports: [
               IonRouterOutlet,
               IonApp],
  templateUrl: './app.component.html',
             styleUrls: ['./app.component.scss']
})
export class AppComponent {
  dark = true;

  rightCLick($event: MouseEvent) {
  }
}

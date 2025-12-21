import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';

@Component({
             selector: 'snap-landing-page',
             imports: [CommonModule, RouterModule, IonicModule],
             templateUrl: './landing.component.html',
             styleUrls: ['./landing.component.scss']
           })
export class LandingComponent {
}

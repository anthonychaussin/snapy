import {provideZonelessChangeDetection} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, RouteReuseStrategy, withComponentInputBinding} from '@angular/router';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';
import {provideTranslateService} from '@ngx-translate/core';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';

import {AppComponent} from './app/app.component';
import {routes} from './app/app.routes';

await bootstrapApplication(AppComponent, {
  providers: [
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    provideZonelessChangeDetection(),
    provideIonicAngular({mode: 'md'}),
    provideRouter(routes, withComponentInputBinding()),
    provideTranslateService({
                              lang: 'en',
                              fallbackLang: 'en',
                              loader: provideTranslateHttpLoader({
                                                                   prefix: '/assets/i18n/',
                                                                   suffix: '.json'
                                                                 })
                            })
  ]
}).catch(console.error);

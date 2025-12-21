import {importProvidersFrom} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, RouteReuseStrategy, withComponentInputBinding} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {provideIonicAngular} from '@ionic/angular/standalone';
import {IonicStorageModule} from '@ionic/storage-angular';
import {provideTranslateService} from '@ngx-translate/core';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';

import {AppComponent} from './app/app.component';
import {routes} from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    provideIonicAngular({mode: 'md'}),
    provideRouter(routes, withComponentInputBinding()),
    importProvidersFrom(IonicModule.forRoot({})),
    provideIonicAngular({}),
    importProvidersFrom(IonicStorageModule.forRoot()),
    provideTranslateService({
                              lang: 'en',
                              fallbackLang: 'en',
                              loader: provideTranslateHttpLoader({
                                                                   prefix: '/assets/i18n/',
                                                                   suffix: '.json'
                                                                 })
                            })
  ]
})
  .catch(err => console.error(err));

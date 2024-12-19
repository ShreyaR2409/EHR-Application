import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { environment } from './environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(), provideAnimationsAsync(),
    provideToastr({ 
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      easing: 'ease-in-out',
      easeTime: 300,
    }),provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideMessaging(() => getMessaging())
  ]
};

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { authInterceptor } from './app/features/auth/interceptors/auth-interceptor.interceptor';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import localeEsDo from '@angular/common/locales/es-DO';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeEsDo);

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(
          withInterceptors([authInterceptor])
        ),
        provideHttpClient(withFetch()),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
        provideAngularSvgIcon(),
        { provide: LOCALE_ID, useValue: 'es-DO' }  // or any locale code

    ]
};

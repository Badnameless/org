import { Routes } from '@angular/router';
import { AppLayout } from './app/shared/component/app.layout';
import { Dashboard } from './app/features/dashboard/dashboard';
import { Landing } from './app/features/landing/landing';
import { Notfound } from './app/features/notfound/notfound';
import { AdminGuard } from './app/features/admin/guards/admin.guard';
import { DashboardGuard } from './app/features/auth/guards/dashboard.guard';
import { ProfileComponent } from './app/features/profile/profile.component';
import { LoadingPageComponent } from './app/features/loading-page/loading-page.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [DashboardGuard],
        children: [
            {
              path: '',
              component: Dashboard,
            },
            {
              path: 'pages',
              loadChildren: () => import('./app/features/pages.routes')
            },
            {
              path: 'admin',
              loadChildren: () => import('./app/features/admin/admin.routes'),
              canActivate: [AdminGuard]
            },
            {
              path: 'encf',
              loadChildren: () => import('./app/features/encf/encf.routes'),
            },
            {
              path: 'profile',
              component: ProfileComponent
            }

        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/features/auth/auth.routes') },
    { path: 'loading', component: LoadingPageComponent },
    { path: '**', redirectTo: '/notfound' },
];

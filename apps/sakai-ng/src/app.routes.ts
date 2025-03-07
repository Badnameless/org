import { Routes } from '@angular/router';
import { AppLayout } from './app/shared/component/app.layout';
import { Dashboard } from './app/features/dashboard/dashboard';
import { Landing } from './app/features/landing/landing';
import { Notfound } from './app/features/notfound/notfound';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'pages', loadChildren: () => import('./app/features/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/features/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];

import { Access } from './pages/access/access';
import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Error } from './pages/error/error';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
] as Routes;

import { Access } from './pages/access/access';
import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Error } from './pages/error/error';
import { LoginGuard } from './guards/login.guard';
import { ChangePasswordComponent } from './pages/changePassword/change-password/change-password.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    {
      path: 'login',
      component: Login,
      canMatch: [LoginGuard]
    },
    { path: 'change_password/:signature/:expires/:email', component: ChangePasswordComponent,
    },
    { path: 'forgotpassword', component: ForgotPasswordComponent }

] as Routes;

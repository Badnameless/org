import { Access } from './pages/access/access';
import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Error } from './pages/error/error';
import { Register } from './pages/register/register.component';
import { VerifyNoticeComponent } from './pages/verifyNotice/verify-notice/verify-notice.component';
import { VerifySucessComponent } from './pages/verifySuccess/verify-sucess/verify-sucess.component';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'verify_notice', component: VerifyNoticeComponent },
    { path: 'verify_success', component: VerifySucessComponent }

] as Routes;

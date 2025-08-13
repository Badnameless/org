import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { User } from '../../../../../../../libs/shared-template/src/lib/shared-template/shared/interfaces/user';
import { Injectable } from '@angular/core';
import { AuthService } from '../../../../../../../libs/shared-template/src/lib/shared-template/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate{

  constructor(private router:Router, private authService: AuthService){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    const user: User = JSON.parse(localStorage.getItem('user')!);

    if(user) return true;

    this.router.navigate(['auth/login']);
    return false;
  }

}



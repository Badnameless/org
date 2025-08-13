import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { User } from '../../../../../../../libs/shared-template/src/lib/shared-template/shared/interfaces/user';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate{

  constructor(private router:Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    const user: User = JSON.parse(localStorage.getItem('user')!);

    if(user.roles[0].name.includes('admin')) return true;

    this.router.navigate(['/'])
    return false;
  }
}

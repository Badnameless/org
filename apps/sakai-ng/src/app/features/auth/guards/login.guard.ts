import { CanMatch, GuardResult, MaybeAsync, Route, Router, UrlSegment} from '@angular/router';
import { User } from '../interfaces/user';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanMatch{

  constructor(private router:Router){}

  canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
    const user: User = JSON.parse(localStorage.getItem('user')!);

    if(!user) return true;

    this.router.navigate(['/']);
    return false;
  }
}

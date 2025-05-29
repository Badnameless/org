import { Component, effect, inject, Injector } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Token } from './app/features/auth/interfaces/token';
import { AuthService } from './app/features/auth/services/auth.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {

  public token!: Token | null;

  constructor(private authService: AuthService) {
    effect(() => {
      this.token = this.authService.exposedToken()
      const tokenFromStorage = localStorage.getItem('token');

      if (!this.token || !tokenFromStorage) return;

      this.setTokenRefreshingInterval(this.token)
    })
  }

  setTokenRefreshingInterval(token: Token | null) {
    if (!token) return;

    let tokenDate = new Date(token.timestamp)
    let invalidationDate = tokenDate.getTime() + (55 * 60 * 1000)
    let invalidationTime = invalidationDate - new Date().getTime()

    setTimeout(async () => {
      await lastValueFrom(this.authService.refreshToken(token))
    }, invalidationTime);
  }
}

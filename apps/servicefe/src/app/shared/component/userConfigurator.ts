import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AuthService } from '../../features/auth/services/auth.service';
import { Token } from '../../features/auth/interfaces/token';
import { lastValueFrom } from 'rxjs';
import { CacheService } from '../../services/cache.service';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-user-configurator',
    standalone: true,
    imports: [CommonModule, FormsModule, SelectButtonModule, ButtonModule],
    templateUrl: './userConfigurator.html',
    host: {
        class: 'hidden absolute top-[4.00rem] right-0 w-72 p-4 bg-surface-0 dark:bg-surface-900 border border-surface rounded-border origin-top shadow-[0px_3px_5px_rgba(0,0,0,0.02),0px_0px_2px_rgba(0,0,0,0.05),0px_1px_4px_rgba(0,0,0,0.08)]'
    }
})
export class UserConfigurator {

  public token = computed<Token | null>(() => this.authService.exposedToken());

  constructor(private router:Router,
              private authService:AuthService,
              private cache: CacheService
            ){}

  showProfile(){
    this.router.navigate(['profile']);
  }

  async logout(){
    await lastValueFrom(this.authService.logout(this.token()!));
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('current_tenant')
    await this.cache.cachedItems.clear();
    this.router.navigate(['auth/login']);

  }
}

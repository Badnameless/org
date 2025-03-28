import { User } from '../../features/auth/interfaces/user';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../features/auth/services/auth.service';
import { lastValueFrom } from 'rxjs';
import { Token } from '../../features/auth/interfaces/token';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
  model: MenuItem[] = [];

  admin_model: MenuItem[] = [];

  public user!: User;
  public token!: Token;

  private user_rol?: string[];
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user')!)

    this.user_rol = this.user.roles?.name;
    this.model = [
      {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
      },
    ];

    this.admin_model = [
      {
        label: 'Admin',
        items: [
          {
            label: 'Registrar Compañias',
            icon: 'pi pi-building',
            routerLink: ['admin/companies']
          },
          {
            label: 'Registrar Usuarios',
            icon: 'pi pi-user',
            routerLink: ['admin/users']
          },
          {
            label: 'Crear Planes',
            icon: 'pi pi-address-book',
            routerLink: ['admin/plans']
          }
        ]
      }
    ];

    if (this.user_rol?.includes('admin')) {
      this.model.push(this.admin_model[0]);
    }






  }
}

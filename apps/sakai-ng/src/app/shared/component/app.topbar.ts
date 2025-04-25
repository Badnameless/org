import { Component, OnInit } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { AuthService } from '../../features/auth/services/auth.service';
import { Tenant, User } from '../../features/auth/interfaces/user';
import { UserConfigurator } from './userConfigurator';
import { Token } from '../../features/auth/interfaces/token';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [UserConfigurator, MenuModule, RouterModule, CommonModule, StyleClassModule, AppConfigurator],
  templateUrl: './app.topbar.html',
  providers: [AuthService]
})
export class AppTopbar implements OnInit{
  items!: MenuItem[];

  public user?: User;
  public token!: Token;
  public current_tenant!: Tenant;

  constructor(public layoutService: LayoutService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.token = JSON.parse(localStorage.getItem('token')!)
    this.user = JSON.parse(localStorage.getItem('user')!)

    if(localStorage.getItem('default_tenant') && !localStorage.getItem('current_tenant')){
      this.current_tenant = JSON.parse(localStorage.getItem('default_tenant')!);
    }else{
      this.current_tenant = JSON.parse(localStorage.getItem('current_tenant')!);
    }

    this.items = [{
      label: this.user?.user_name,
      icon: 'pi pi-user',
    }]
  }

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }
}

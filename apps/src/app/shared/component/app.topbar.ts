import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { Popover, PopoverModule } from 'primeng/popover';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { ScrollerModule, Scroller } from 'primeng/scroller';
import { Notificacion } from '../interfaces/Notificacion';
import { NotificationService } from '../service/notification.service';
import { DateAgoPipe } from '../pipes/date-ago.pipe';
import { WebSocketService } from '../service/web-socket.service';
@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [UserConfigurator,
    MenuModule,
    RouterModule,
    CommonModule,
    StyleClassModule,
    AppConfigurator,
    PopoverModule,
    OverlayBadgeModule,
    ScrollerModule,
    DateAgoPipe],
  templateUrl: './app.topbar.html',
  styles: ``,
  providers: [AuthService]
})
export class AppTopbar implements OnInit {
  items!: MenuItem[];

  public user?: User;
  public token!: Token;
  public current_tenant!: Tenant;
  public notifications!: Notificacion[];
  public nonReadNotifications!: Notificacion[];

  @ViewChild('inboxscroller') scroller!: Scroller;
  @ViewChild('inbox') inbox!: Popover;

  constructor(public layoutService: LayoutService,
    private notificationService: NotificationService,
    private wsService: WebSocketService
  ) { }

  async ngOnInit() {
    this.notifications = (await this.notificationService.getNotifications());
    this.notifications = this.notifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());


    this.nonReadNotifications = this.notifications.filter(notification => !notification.notificaciones_leido)

    this.token = JSON.parse(localStorage.getItem('token')!)
    this.user = JSON.parse(localStorage.getItem('user')!)

    this.wsService.listenToUserNotifications(this.user!.user_id, (notificacion) => {
      this.notifications.unshift(notificacion);
      this.nonReadNotifications.unshift(notificacion);

    })

    this.current_tenant = JSON.parse(localStorage.getItem('default_tenant')!);


    this.items = [{
      label: this.user?.user_name,
      icon: 'pi pi-user',
    }]
  }

  onInboxHide() {
    this.scroller.ngOnDestroy();
  }

  async readNotifications() {
    if (this.nonReadNotifications.length < 1) return;

    let readedNotifications: number[] = [];

    while (this.nonReadNotifications.length > 0) {
      const item = this.nonReadNotifications.pop();
      if (item) {
        readedNotifications.push(item.notificaciones_id);
      }
    }

    await this.notificationService.readNotifications(readedNotifications)
  }

  notificationLazyLoad() {
    console.log('lazy loading')
  }

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }
}

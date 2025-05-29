import { ChangeDetectorRef, Component, OnInit, signal, ViewChild, computed, effect } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
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
import { ButtonModule } from 'primeng/button';
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
    DateAgoPipe,
    ButtonModule],
  templateUrl: './app.topbar.html',
  styles: ``,
})
export class AppTopbar implements OnInit {
  items!: MenuItem[];

  public user?: User;
  public token!: Token;
  public current_tenant!: Tenant;

  public allNotifications = signal<Notificacion[]>([]);
  public nonReadNotifications = computed<Notificacion[]>(() =>
    this.allNotifications().filter(notification => !notification.notificaciones_leido)
  );

  public notifications = signal<Notificacion[]>([]);
  public isAllNotificationMode = signal<boolean>(false);
  public changeNotificationModeMsg = signal<string>('');
  public scrollHeight = signal<string>('');

  @ViewChild('inboxscroller') scroller!: Scroller;
  @ViewChild('inbox') inbox!: Popover;

  constructor(public layoutService: LayoutService,
    private notificationService: NotificationService,
    private wsService: WebSocketService,
  ) {

    effect(() => {

      this.nonReadNotifications = computed(() =>
        this.allNotifications().filter(notification => !notification.notificaciones_leido).sort((a, b) => a.tipoNotificaciones_id - b.tipoNotificaciones_id)
      );

      if (this.isAllNotificationMode()) {
        this.changeNotificationModeMsg.update(value => value = 'Ver notificaciones sin leer');
        this.notifications.set(this.allNotifications());

      } else {
        this.changeNotificationModeMsg.update(value => value = 'Ver todas las notificaciones');
        this.notifications.set(this.nonReadNotifications());
      }

      if (this.notifications().length > 0) {
        this.scrollHeight.set('400px')
      } else {
        this.scrollHeight.set('0px')
      }

    })
  }

  async ngOnInit() {
    this.allNotifications.set((await this.notificationService.getNotifications()));
    this.allNotifications.update(value => value = this.allNotifications().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))

    this.nonReadNotifications = computed(() =>
      this.allNotifications().filter(notification => !notification.notificaciones_leido).sort((a, b) => a.tipoNotificaciones_id - b.tipoNotificaciones_id)
    );

    this.token = JSON.parse(localStorage.getItem('token')!)
    this.user = JSON.parse(localStorage.getItem('user')!)

    this.wsService.listenToUserNotifications(this.user!.user_id, (notificacion) => {
      this.allNotifications.update(value => [notificacion, ...value]);
      this.notificationService.addWebSocketNotification(notificacion);
    })

    this.current_tenant = JSON.parse(localStorage.getItem('default_tenant')!);

    this.items = [{
      label: this.user?.user_name,
      icon: 'pi pi-user',
    }]
  }

  onInboxHide() {
    this.isAllNotificationMode.set(false);
    this.scroller.ngOnDestroy();
  }

  async readNotifications() {
    if (this.nonReadNotifications().length < 1) return;

    const current = [...this.nonReadNotifications()];
    const readedNotifications: number[] = [];

    while (current.length > 0) {
      const item = current.pop();
      if (item) {
        readedNotifications.push(item.notificaciones_id);

        this.allNotifications.update(value => {
          let updatedNotifications: Notificacion[] = value.map(notificacion => {
            notificacion.notificaciones_id === item.notificaciones_id ? notificacion.notificaciones_leido = true : notificacion

            return notificacion
          })
          return updatedNotifications;
        })
      }
    }



    await this.notificationService.readNotifications(readedNotifications)
  }

  toggleNotificationMode() {
    this.isAllNotificationMode.update(value => value = !value);
  }

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }
}

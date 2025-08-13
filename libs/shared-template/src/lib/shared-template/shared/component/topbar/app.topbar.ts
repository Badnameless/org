import {
  Component,
  OnInit,
  signal,
  ViewChild,
  computed,
  effect,
} from "@angular/core";
import { MenuModule } from "primeng/menu";
import { MenuItem } from "primeng/api";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { StyleClassModule } from "primeng/styleclass";
import { AppConfigurator } from "../app.configurator";
import { LayoutService } from "../../services/layout.service";
import { Tenant, User } from "../../interfaces/user";
import { UserConfigurator } from "../userConfigurator/userConfigurator";
import { Token } from "../../interfaces/token";
import { Popover, PopoverModule } from "primeng/popover";
import { OverlayBadgeModule } from "primeng/overlaybadge";
import { ScrollerModule, Scroller } from "primeng/scroller";
import { Notificacion } from "../../../../../../../../apps/sakai-ng/src/app/shared/interfaces/Notificacion";
import { NotificationService } from "@org/shared-template";
import { DateAgoPipe } from "../../pipes/date-ago.pipe";
import { WebSocketService } from "../../services/web-socket.service";
import { ButtonModule } from "primeng/button";
import { AvatarModule } from "primeng/avatar";
import { AuthService } from "../../services/auth.service";
import { HttpService } from "../../../../../../../../apps/sakai-ng/src/app/services/http.service";
import { ProfileService } from "../../../../../../../../apps/sakai-ng/src/app/features/profile/services/profile.service";
@Component({
  selector: "app-topbar",
  standalone: true,
  imports: [
    UserConfigurator,
    MenuModule,
    RouterModule,
    CommonModule,
    StyleClassModule,
    AppConfigurator,
    PopoverModule,
    OverlayBadgeModule,
    ScrollerModule,
    DateAgoPipe,
    ButtonModule,
    AvatarModule,
  ],
  templateUrl: "./app.topbar.html",
  styles: ``,
})
export class AppTopbar implements OnInit {
  items!: MenuItem[];
  imgUrl = computed<string>(() => this.profileService.imgUrl());

  public allNotifications = signal<Notificacion[]>([]);
  public nonReadNotifications = computed<Notificacion[]>(() =>
    this.allNotifications().filter(
      (notification) => !notification.notificaciones_leido,
    ),
  );

  public user = computed<User | null>(() => this.authService.exposedUser());
  public token = computed<Token | null>(() => this.authService.exposedToken());
  public current_tenant = computed<Tenant | undefined>(() => {
    const currentTenant: Tenant = JSON.parse(
      localStorage.getItem("current_tenant")!,
    );
    if (currentTenant) {
      return currentTenant;
    } else {
      return this.authService.user()?.tenants[0];
    }
  });

  public notifications = signal<Notificacion[]>([]);
  public isAllNotificationMode = signal<boolean>(false);
  public changeNotificationModeMsg = signal<string>("");
  public scrollHeight = signal<string>("");

  @ViewChild("inboxscroller") scroller!: Scroller;
  @ViewChild("inbox") inbox!: Popover;

  constructor(
    public layoutService: LayoutService,
    private notificationService: NotificationService,
    private wsService: WebSocketService,
    private authService: AuthService,
    private profileService: ProfileService,
  ) {
    effect(async () => {
      this.nonReadNotifications = computed(() =>
        this.allNotifications()
          .filter((notification) => !notification.notificaciones_leido)
          .sort((a, b) => a.tipoNotificaciones_id - b.tipoNotificaciones_id),
      );

      if (this.isAllNotificationMode()) {
        this.changeNotificationModeMsg.update(
          (value) => (value = "Ver notificaciones sin leer"),
        );
        this.notifications.set(this.allNotifications());
      } else {
        this.changeNotificationModeMsg.update(
          (value) => (value = "Ver todas las notificaciones"),
        );
        this.notifications.set(this.nonReadNotifications());
      }

      if (this.notifications().length > 0) {
        this.scrollHeight.set("400px");
      } else {
        this.scrollHeight.set("0px");
      }

      await profileService.getUserPhoto();
    });
  }

  async ngOnInit() {
    this.allNotifications.set(
      await this.notificationService.getNotifications(),
    );
    this.allNotifications.update(
      (value) =>
        (value = this.allNotifications().sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )),
    );

    this.nonReadNotifications = computed(() =>
      this.allNotifications()
        .filter((notification) => !notification.notificaciones_leido)
        .sort((a, b) => a.tipoNotificaciones_id - b.tipoNotificaciones_id),
    );

    this.wsService.listenToUserNotifications(
      this.user()!.user_id,
      (notificacion) => {
        this.allNotifications.update((value) => [notificacion, ...value]);
        this.notificationService.addWebSocketNotification(notificacion);
      },
    );

    this.items = [
      {
        label: this.user()?.user_name,
        icon: "pi pi-user",
      },
    ];

    this.profileService.getUserPhoto();
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

        this.allNotifications.update((value) => {
          let updatedNotifications: Notificacion[] = value.map(
            (notificacion) => {
              notificacion.notificaciones_id === item.notificaciones_id
                ? (notificacion.notificaciones_leido = true)
                : notificacion;

              return notificacion;
            },
          );
          return updatedNotifications;
        });
      }
    }

    await this.notificationService.readNotifications(readedNotifications);
  }

  toggleNotificationMode() {
    this.isAllNotificationMode.update((value) => (value = !value));
  }

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({
      ...state,
      darkTheme: !state.darkTheme,
    }));
  }
}

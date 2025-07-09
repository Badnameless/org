import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { Token } from '../../features/auth/interfaces/token';
import { Notificacion } from '../interfaces/Notificacion';
import { HttpService } from '../../services/http.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

    private echo: any;


  constructor(private httpService: HttpService) {
    (window as any).Pusher = Pusher;

    const token: Token = JSON.parse(localStorage.getItem('token')!);

    this.echo = new Echo({
      broadcaster: 'pusher',
      key: 'oncqphaohqg4pkydsefa',
      cluster: 'mt1',
      wsHost: 'localhost',
      wsPort: 6001,
      forceTLS: true,
      disableStats: true,
      authEndpoint: `${httpService.AUTH_URL}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      },
    });
  }

    listenToUserNotifications(userId: number, callback: (notification: Notificacion) => void) {
    this.echo.private(`notification.${userId}`)
      .listen('.NewNotification', (e: any) => {
        callback(e.notificacion);
      });
  }
}

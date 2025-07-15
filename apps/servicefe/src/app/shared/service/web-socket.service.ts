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

  constructor(private http: HttpService) {
    (window as any).Pusher = Pusher;

    const token: Token = JSON.parse(localStorage.getItem('token')!);

    this.echo = new Echo({
      broadcaster: 'pusher',
      key: 'oncqphaohqg4pkydsefa',
      cluster: 'mt1',
      wsHost: http.HOST,
      wsPort: 443,
      forceTLS: true,
      authEndpoint: `${http.AUTH_URL}/broadcasting/auth`,
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

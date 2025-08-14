import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { Token } from '../interfaces/token';
import { Notificacion } from '../interfaces/Notificacion';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private echo: any;


  constructor(private http: HttpService) {
    (window as any).Pusher = Pusher;

    const token: Token = JSON.parse(localStorage.getItem('token')!);

    this.echo = new Echo({
      broadcaster: 'reverb',
      key: 'oncqphaohqg4pkydsefa',
      cluster: 'mt1',
      wsHost: this.http.HOST,
      wsPort: 443,
      forceTLS: true,
      authEndpoint: `${this.http.AUTH_URL}/broadcasting/auth`,
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
  //actualizar Servicios Status
  listenToServicesFE(callback: (services: any) => void) {
    this.echo.private(`udateServiceFE`)
      .listen('.udateServiceFE', (e: any) => {
        callback(e.services);
      });
  }
}

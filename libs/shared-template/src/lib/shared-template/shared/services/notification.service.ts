import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { HttpService } from '../../../../../../../apps/sakai-ng/src/app/services/http.service';
import { Token } from '../interfaces/token';
import { Notificacion } from '../../../../../../../apps/sakai-ng/src/app/shared/interfaces/Notificacion';
import { lastValueFrom, map } from 'rxjs';
import { CacheService } from './cache.service';
import { WebSocketService } from './web-socket.service';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private user: User = JSON.parse(localStorage.getItem('user')!);
  private cacheKey = 'api/notifications';
  private ttl: number = 1000 * 60 * 5;

  private _notifications = signal<Notificacion[]>([]);

  public notifications = this._notifications.asReadonly();

  constructor(private http: HttpClient,
    private httpService: HttpService,
    private cache: CacheService,
    private wsService: WebSocketService
  ) {
    this.loadNotifications();

    wsService.listenToUserNotifications(this.user.user_id, async (notificacion) => {
      let cached: Notificacion[] = await this.cache.getCache(this.cacheKey, this.ttl);
      cached.push(notificacion);
      cache.setCache(this.cacheKey, cached);
      this._notifications.update(current => [...current, notificacion]);
    })
  }

  async addWebSocketNotification(notificacion: Notificacion) {
    let cached: Promise<Notificacion[]> = await this.cache.getCacheWithoutTtl(this.cacheKey);
    (await cached).push(notificacion);
    this.cache.setCache(this.cacheKey, cached);
  }

  async getNotifications(): Promise<Notificacion[]> {
    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const cached: Promise<Notificacion[]> = await this.cache.getCache(this.cacheKey, this.ttl);

    if (cached) return cached;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    const data: Notificacion[] = await lastValueFrom(this.http.get<Notificacion[]>(`${this.httpService.API_URL}/get/notifications`, { headers }));

    this.cache.setCache(this.cacheKey, data);

    return data;
  }

  async readNotifications(notificaciones: number[]): Promise<Notificacion[]> {
    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    let data: Notificacion[] = await lastValueFrom(this.http.post<Notificacion[]>(`${this.httpService.API_URL}/read/notifications`, { notificaciones }, { headers }).pipe(
      map(notificacion => notificacion.map(notificacion => ({
        ...notificacion,
        created_at: new Date(notificacion.created_at)
      })))
    ))

    this.cache.setCache(this.cacheKey, data);

    return data
  }

  private async loadNotifications() {
    const data = await this.getNotifications();
    this._notifications.set(data);
  }
}

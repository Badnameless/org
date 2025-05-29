import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Token } from '../../features/auth/interfaces/token';
import { Notificacion } from '../interfaces/Notificacion';
import { lastValueFrom, map } from 'rxjs';
import { CacheService } from '../../services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient,
    private httpService: HttpService,
    private cache: CacheService
  ) { }

  private cacheKey = 'api/notifications';
  private ttl: number = 1000 * 60 * 5;

  async getNotifications(): Promise<Notificacion[]> {
    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const cached: Promise<Notificacion[]> = await this.cache.getCache(this.cacheKey, this.ttl);

    if (cached) return cached;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    const data: Notificacion[] = await lastValueFrom(this.http.get<Notificacion[]>(`${this.httpService.API_URL}/get/notifications`, { headers }))

    this.cache.setCache(this.cacheKey, data);

    return data;
  }

  async readNotifications(notificaciones: number[]): Promise<Notificacion[]>{
    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    let data: Notificacion[] = await lastValueFrom(this.http.post<Notificacion[]>(`${this.httpService.API_URL}/read/notifications`, { notificaciones } , { headers }).pipe(
          map(notificacion => notificacion.map(notificacion => ({
            ...notificacion,
            created_at: new Date(notificacion.created_at)
          })))
        ))

    this.cache.setCache(this.cacheKey, data);

    return data
  }
}

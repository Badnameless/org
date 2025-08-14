import { inject, Injectable, signal } from '@angular/core';
import { CacheService } from '../../../../../../../libs/shared-template/src/lib/shared-template/shared/services/cache.service';
import { HttpService } from '../../../../../../../libs/shared-template/src/lib/shared-template/shared/services/http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServiceStatus } from '../interfaces/interface';
import { Token } from '../../../../../../../libs/shared-template/src/lib/shared-template/shared/interfaces/token';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusServicesService {

  private ttl: number = 1000 * 60 * 30;
  private cacheKey: string = 'api/services/status';
  data = signal<ServiceStatus[]>([]);
  http = inject(HttpClient);
  httpService = inject(HttpService);
  cache = inject(CacheService);



  constructor() { }

  async getStatus() {
    const cached: Promise<ServiceStatus[]> = await this.cache.getCache(this.cacheKey, this.ttl);

    if (cached) return cached;

    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    const data = await lastValueFrom(this.http.get<ServiceStatus[]>(`${this.httpService.API_URL}/cs-services`, { headers }));

    this.data.set(data);
    console.log(data);

    return data;

  }

}


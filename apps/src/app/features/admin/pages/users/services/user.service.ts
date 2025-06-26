import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { HttpService } from '../../../../../services/http.service';
import { FormGroup } from '@angular/forms';
import { lastValueFrom, Observable, switchMap } from 'rxjs';
import { Token } from '../../../../auth/interfaces/token';
import { User } from '../../../../auth/interfaces/user';
import { EmailTakenResponse } from '../interfaces/email-taken-response';
import { CacheService } from '../../../../../services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private ttl: number = 1000 * 60 * 10;
  private cacheKey: string = 'api/users/all';
  users = signal<User[]>([]);

  constructor(private http: HttpClient,
    private httpService: HttpService,
    private cache: CacheService
  ) { }

  async getUsers() {
    const cached: Promise<User[]> = await this.cache.getCache(this.cacheKey, this.ttl);

    if (cached) {
      this.users.set(await cached)
    } else {
      const token: Token = JSON.parse(localStorage.getItem('token')!);
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

      const data = await lastValueFrom(this.http.get<User[]>(`${this.httpService.API_URL}/get/users`, { headers }));

      this.cache.setCache(this.cacheKey, data);

      this.users.set(data);
    }
  }

  async storeUser(form: FormGroup) {
    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    const response = await lastValueFrom(this.http.post<User>(`${this.httpService.API_URL}/create/user`, form));

    if (response) {
      const cached: User[] = await this.cache.getCache(this.cacheKey, this.ttl);

      cached.push(response)
      await this.cache.setCache(this.cacheKey, cached);
      this.users.set(cached)
    }
  }

  async updateUser(form: FormGroup, id: number): Promise<EmailTakenResponse | User> {
    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    const response = await lastValueFrom(this.http.put<EmailTakenResponse | User>(`${this.httpService.API_URL}/update/user`, form, { headers }))

    if ('emailIsTaken' in response) {
      return response
    } else {
      const cached: User[] = await this.cache.getCache(this.cacheKey, this.ttl);

      const updatedUser = cached.map(user =>
        user.user_id === id ? response : user
      )
      await this.cache.setCache(this.cacheKey, updatedUser)
      this.users.set(updatedUser)
      return response
    }
  }

  async deleteUsers(user_ids: number[]) {
    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    const params = new HttpParams().set('user_ids', user_ids.join(','));

    try {
      await lastValueFrom(this.http.delete<number[]>(`${this.httpService.API_URL}/delete/users`, { headers, params }))

      const cached: User[] = await this.cache.getCache(this.cacheKey, this.ttl);

      const updated = cached.filter(user => !user_ids.includes(user.user_id))
      await this.cache.setCache(this.cacheKey, updated);
      this.users.set(updated);
    } catch (error) {
      console.log(error)
    }

  }

  changePassword(form: FormGroup): Observable<HttpResponse<FormGroup>> {
    return this.http.post<HttpResponse<FormGroup>>(`${this.httpService.API_URL}/change/password`, form);
  }

  sendEmailRecoverPassword(email: string): Observable<HttpResponse<FormGroup>> {
    return this.http.post<FormGroup>(`${this.httpService.API_URL}/RecoverPassword`, email, { observe: 'response' });
  }

  verifyResetToken(Signature: string, Expires: string, User: string): Observable<HttpResponse<[]>> {
    return this.http.post<any>(`${this.httpService.API_URL}/verify_reset_token`, { signature: Signature, expires: Expires, user: User }, { observe: 'response' })
  }
}

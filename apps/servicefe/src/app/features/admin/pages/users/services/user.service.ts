import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  constructor(private http: HttpClient,
    private httpService: HttpService,
    private cache: CacheService
  ) { }

  private ttl: number = 1000 * 60 * 10;
  private cacheKey: string = 'api/users/all';

  async getUsers(): Promise<User[]> {
    const cached: Promise<User[]> = await this.cache.getCache(this.cacheKey, this.ttl);

    if (cached) return cached;

    const token: Token = JSON.parse(localStorage.getItem('token')!);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    const data = await lastValueFrom(this.http.get<User[]>(`${this.httpService.API_URL}/get/users`, { headers }));

    this.cache.setCache(this.cacheKey, data);

    return data;
  }

  storeUser(form: FormGroup): Observable<User> {
    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    return this.http.post<User>(`${this.httpService.API_URL}/create/user`, form).pipe(
      switchMap(async (response) => {
        const cached: User[] = await this.cache.getCache(this.cacheKey, this.ttl);

        if(cached){
          cached.push(response)
          await this.cache.setCache(this.cacheKey, cached);
        }
        return response;
      })
    );
  }

  updateUser(form: FormGroup, id: number): Observable<EmailTakenResponse | User> {
    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    return this.http.put<EmailTakenResponse | User>(`${this.httpService.API_URL}/update/user`, form, { headers }).pipe(
      switchMap(async (response) => {
        const cached: User[] = await this.cache.getCache(this.cacheKey, this.ttl);

        if(cached){
          const updatedUser = cached.map(user =>
            user.user_id === id ? response : user
          )
          await this.cache.setCache(this.cacheKey, updatedUser)
        }
        return response
      })
    );
  }

  deleteUsers(user_ids: number[]) {
    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    const params = new HttpParams().set('user_ids', user_ids.join(','));

    return this.http.delete<number[]>(`${this.httpService.API_URL}/delete/users`, { headers, params }).pipe(
      switchMap(async () => {
        const cached: User[] = await this.cache.getCache(this.cacheKey, this.ttl);

        if(cached){
          const updated = cached.filter(user => !user_ids.includes(user.user_id))
          await this.cache.setCache(this.cacheKey, updated);
        }
      })
    );
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

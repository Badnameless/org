import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, Injectable, OnInit, signal } from '@angular/core';
import { User } from '../interfaces/user';
import { lastValueFrom, map, Observable, of, retry, Subscription, tap } from 'rxjs';
import { HttpService } from '../../../services/http.service';
import { Token } from '../interfaces/token';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user = signal<User | null>(null);
  private token = signal<Token | null>(null);

  readonly exposedToken = this.token.asReadonly();
  readonly exposedUser = this.user.asReadonly();

  readonly userImg = computed<Promise<Blob | string>>(async () => {
    if (this.user()?.user_photoUrl) {
      const imgObservable = this.http.get<Blob>(`${this.httpService.API_URL}/user/get_photo/${this.user()?.user_photoUrl}`, { responseType: 'blob' as 'json' });
      const img: Blob = await lastValueFrom(imgObservable);

      return img;
    }else{
      return 'images/user.png';
    }


  });

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
  ) {
    const tokenFromStorage = localStorage.getItem('token');
    const userFromStorage = localStorage.getItem('user');

    if (tokenFromStorage) {
      this.token.set(JSON.parse(tokenFromStorage));
    }

    if (userFromStorage) {
      this.user.set(JSON.parse(userFromStorage));
    }
  }

  login(email: string, password: string): Observable<Token> {
    return this.http.post<Token>(`${this.httpService.AUTH_URL}/login`, { email, password })
      .pipe(
        tap(token => localStorage.setItem('token', JSON.stringify(token))),
        tap(token => this.token.set(token)),
        tap(token => token.timestamp = new Date(token.timestamp)),
        tap(async token => await lastValueFrom(this.storeAuthUser(token)))
      );
  }

  storeAuthUser(token?: Token): Observable<User> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token!.access_token}`);

    return this.http.post<User>(`${this.httpService.AUTH_URL}/me`, {}, { headers }).pipe(
      tap(user => localStorage.setItem('user', JSON.stringify(user))),
      tap(user => this.user.set(user)),
    );
  }

  refreshToken(token: Token): Observable<Token> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    return this.http.post<Token>(`${this.httpService.AUTH_URL}/refresh`, {}, { headers }).pipe(
      tap(token => localStorage.setItem('token', JSON.stringify(token))),
      tap(token => this.token.set(token)),
      tap(token => token.timestamp = new Date(token.timestamp))
    );
  }

  logout(token: Token): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    return this.http.post(`${this.httpService.AUTH_URL}/logout`, {}, { headers });
  }
}

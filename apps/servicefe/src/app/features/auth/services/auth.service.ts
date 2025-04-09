import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import {  Observable, of, tap } from 'rxjs';
import { HttpService } from '../../../services/http.service';
import { Token } from '../interfaces/token';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user!: User;
  public token!: Token;

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private router: Router
  ) { }

  get _user() {
    return structuredClone(this.user);
  }

  get _token() {
    return structuredClone(this.token);
  }

  login(email: string, password: string): Observable<Token> {
    return this.http.post<Token>(`${this.httpService.AUTH_URL}/login`, { email, password })
      .pipe(
        tap(token => localStorage.setItem('token', JSON.stringify(token))),
        tap(token => this.token = token),
      );
  }

  storeAuthUser(token: Token): Observable<User> {

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    return this.http.post<User>(`${this.httpService.AUTH_URL}/me`, {}, { headers }).pipe(
      tap(user => localStorage.setItem('user', JSON.stringify(user))),
      tap(user => this.user = user),
    );

  }

  refreshToken(token: Token): Observable<Token> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    return this.http.post<Token>(`${this.httpService.AUTH_URL}/refresh`, {}, { headers });
  }

  logout(token: Token): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    return this.http.post(`${this.httpService.AUTH_URL}/logout`, {}, { headers });
  }
}

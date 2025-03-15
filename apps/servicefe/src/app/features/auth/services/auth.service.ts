import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Observable, tap } from 'rxjs';
import { HttpService } from '../../../services/http.service';
import { Token } from '../interfaces/token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user?:User;

  private token?: Token;

  get _token(){
    return this.token;
  }

  constructor(
    private http:HttpClient,
    private httpService:HttpService
  ) { }

  get currentUser(): User | undefined{
    if(!this.user) return undefined
    return structuredClone(this.user);
  }

  login(email: string, password: string): Observable<Token>{
    return this.http.post<Token>(`${this.httpService.AUTH_URL}/login`, {email, password})
      .pipe(
        tap(token => {
          this.token = token;
          localStorage.setItem('token', JSON.stringify(token));
          this.getAuthUser(token.access_token).subscribe()
        }
      )
      );
  }

  getAuthUser(token: string): Observable<User> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<User>(`${this.httpService.AUTH_URL}/me`, {}, { headers }).pipe(
      tap((user) => {
        localStorage.setItem('user', JSON.stringify(user))
        this.user = user;
      }),

    );
  }
}

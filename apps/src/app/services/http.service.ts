import { Injectable } from '@angular/core';
import { Token } from '../features/auth/interfaces/token';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor() { }

  private _API_URL = 'http://localhost:8080/api';
  private _AUTH_URL = 'http://localhost:8080/api/auth';

  get API_URL() {
    return this._API_URL;
  }

  get AUTH_URL() {
    return this._AUTH_URL;
  }

  get header() {
    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    return headers;
  }
}

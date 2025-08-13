import { Injectable } from '@angular/core';
import { Token } from '../../../../../libs/shared-template/src/lib/shared-template/shared/interfaces/token';
import { HttpHeaders } from '@angular/common/http';
import { environment } from './.././../environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor() { }

  private _API_URL = environment._API_URL;
  private _AUTH_URL = environment._AUTH_URL;
  private _HOST = environment._HOST;

  get API_URL() {
    return this._API_URL;
  }

  get AUTH_URL() {
    return this._AUTH_URL;
  }

  get HOST() {
    return this._HOST;
  }

  get header() {
    const token: Token = JSON.parse(localStorage.getItem('token')!);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    return headers;
  }
}

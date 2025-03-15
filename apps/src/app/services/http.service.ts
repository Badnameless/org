import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor() { }

  private _API_URL = 'http://localhost:8080/api';
  private _AUTH_URL = 'http://localhost:8080/api/auth';

  get API_URL(){
    return this._API_URL;
  }

  get AUTH_URL(){
    return this._AUTH_URL;
  }

}

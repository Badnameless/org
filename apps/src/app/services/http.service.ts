import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor() { }

  private _API_URL = 'http://portal.fe.apps.rancher.sg.local/api';
  private _AUTH_URL = 'http://portal.fe.apps.rancher.sg.local/api/auth';

  get API_URL(){
    return this._API_URL;
  }

  get AUTH_URL(){
    return this._AUTH_URL;
  }

}

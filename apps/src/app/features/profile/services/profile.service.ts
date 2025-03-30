import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { Token } from '../../auth/interfaces/token';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from '../../auth/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(public http:HttpClient, private httpService: HttpService) { }

  public updateName(form:FormGroup, token: Token): Observable<User>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);
    return this.http.put<User>(`${this.httpService.API_URL}/user/update_name`, form, { headers } )
  }

  public updateEmail(form: FormGroup, token: Token): Observable<User>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);
    return this.http.post<User>(`${this.httpService.API_URL}/user/send_emailtochange`, form, { headers });
  }

  public updatePassword(email: string, token: Token){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);
    return this.http.post(`${this.httpService.API_URL}/user/send_passwordtochange`, { user_email: email }, { headers });
  }

  public updatePhoto(img: File, token: Token): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    const formData = new FormData();
    formData.append('user_photo', img);

    for (const pair of formData.entries()) {
      console.log(pair[0]);
    }

    return this.http.post(`${this.httpService.API_URL}/user/update_photo`, formData, { headers });
  }
}

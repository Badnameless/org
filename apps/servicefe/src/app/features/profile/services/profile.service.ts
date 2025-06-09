import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { Token } from '../../auth/interfaces/token';
import { FormGroup } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { User } from '../../auth/interfaces/user';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  public user = computed(() => {
    return  this.authService.exposedUser()
  });

  constructor(public http: HttpClient,
    private httpService: HttpService,
    private authService: AuthService) {

  }

  public updateName(form: FormGroup, token: Token): Observable<User> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);
    return this.http.put<User>(`${this.httpService.API_URL}/user/update_name`, form, { headers }).pipe(
      tap(user => localStorage.setItem('user', JSON.stringify(user))),
      tap(user => this.authService.user.set(user))
    )
  }

  public updateEmail(form: FormGroup, token: Token): Observable<User> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);
    return this.http.post<User>(`${this.httpService.API_URL}/user/send_emailtochange`, form, { headers });
  }

  public updatePassword(email: string, token: Token) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);
    return this.http.post(`${this.httpService.API_URL}/user/send_passwordtochange`, { user_email: email }, { headers });
  }

  public updatePhoto(img: File, token: Token): Observable<User> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);

    const formData = new FormData();
    formData.append('user_photo', img);

    return this.http.post<User>(`${this.httpService.API_URL}/user/update_photo`, formData, { headers }).pipe(
      tap(user => localStorage.setItem('user', JSON.stringify(user))),
      tap(user => this.authService.user.set(user))
    );
  }
}

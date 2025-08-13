import { Injectable } from '@angular/core';
import { Tenant, User } from '../../../../../libs/shared-template/src/lib/shared-template/shared/interfaces/user';
import { Token } from '../../../../../libs/shared-template/src/lib/shared-template/shared/interfaces/token';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  get tenantId() {
    const currentTenant: Tenant = JSON.parse(localStorage.getItem('current_tenant')!);
    return currentTenant.tenant_id;
  }

  get token() {
    const token: Token = JSON.parse(localStorage.getItem('token')!);
    return token;
  }

  get user() {
    const user: User = JSON.parse(localStorage.getItem('user')!);
    return user;
  }

  get userAvatar() {
    const user: User = JSON.parse(localStorage.getItem('user')!);
    return user.user_photoUrl;
  }
}

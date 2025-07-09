import { Injectable } from '@angular/core';
import { Tenant, User } from '../../features/auth/interfaces/user';
import { Token } from '../../features/auth/interfaces/token';

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
}

import { Injectable } from '@angular/core';
import { Tenant } from '../../features/auth/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  get tenantId(){
    const currentTenant: Tenant = JSON.parse(localStorage.getItem('current_tenant')!);
    return currentTenant.tenant_id;
  }
}

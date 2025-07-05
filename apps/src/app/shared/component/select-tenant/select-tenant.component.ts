import { Component, OnInit } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Tenant, User } from '../../../features/auth/interfaces/user';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { EncfService } from '../../../features/encf/services/encf-service.service';
import { CacheService } from '../../../services/cache.service';

@Component({
  selector: 'app-select-tenant',
  imports: [SelectModule, FloatLabelModule, ReactiveFormsModule],
  templateUrl: './select-tenant.component.html',
  styles: ``
})
export class SelectTenantComponent implements OnInit{

  public cacheKey: string = 'api/encfs';
  public user: User = JSON.parse(localStorage.getItem('user')!);
  public current_tenant!: Tenant;

  public selectTenant = new FormControl();

  constructor(private encfService: EncfService,
              private cache: CacheService
  ){}

  ngOnInit(): void {
    let storedTenant: Tenant;

    if(localStorage.getItem('default_tenant') && !localStorage.getItem('current_tenant')){
      storedTenant = JSON.parse(localStorage.getItem('default_tenant')!);
    }else{
      storedTenant = JSON.parse(localStorage.getItem('current_tenant')!);
    }

    if (storedTenant) {
      const matchingTenant = this.user.tenants.find(t => t.tenant_id === storedTenant.tenant_id);
      this.selectTenant.setValue(matchingTenant || null);
    }
  }

  async onSelectTenant(){
    const selectedTenant = this.selectTenant.value;
    localStorage.setItem('current_tenant', JSON.stringify(selectedTenant));

    await this.cache.deleteCache(this.cacheKey);
    await this.encfService.getEncfs(10, 1);
    window.location.reload();
  }
}

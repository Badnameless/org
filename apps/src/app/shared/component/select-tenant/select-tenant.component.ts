import { Component, OnInit } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Tenant, User } from '../../../features/auth/interfaces/user';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-tenant',
  imports: [SelectModule, FloatLabelModule, ReactiveFormsModule],
  templateUrl: './select-tenant.component.html',
  styles: ``
})
export class SelectTenantComponent implements OnInit{

  public user!: User;

  public selectTenant = new FormControl(JSON.parse(localStorage.getItem('current_tenant')!));

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')!);
  }

  onSelectTenant(){
    const selectedTenant = this.selectTenant.value;
    localStorage.setItem('current_tenant', JSON.stringify(selectedTenant))
    console.log(JSON.parse(localStorage.getItem('current_tenant')!))

    window.location.reload();
  }
}

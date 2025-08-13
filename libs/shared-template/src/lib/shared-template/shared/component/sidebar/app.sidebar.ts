import { Component } from '@angular/core';
import { AppMenu } from '../app.menu';
import { SelectTenantComponent } from '../select-tenant/select-tenant.component';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu, SelectTenantComponent],
    templateUrl: './app.sidebar.html'

})
export class AppSidebar {}

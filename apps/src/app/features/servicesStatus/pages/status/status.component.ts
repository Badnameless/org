import { Component, inject, OnInit } from '@angular/core';
import { DataGridComponent } from '../../../../shared/component/data-grid/data-grid.component';
import { Column } from '../../../../shared/component/data-grid/interfaces/column';
import { ServiceStatus } from '../../interfaces/interface';
import { StatusServicesService } from '../../services/status-services.service';

@Component({
  selector: 'app-status',
  imports: [DataGridComponent],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})
export class StatusComponent implements OnInit {
  columns: Column[] = [];
  statusServices = inject(StatusServicesService);


  filterFields: string[] = ['IP', 'Hostname', 'Status', 'OsfInfo', 'LastConnection', 'TenantId' ];


  data: ServiceStatus[] = [];


  async ngOnInit() {
    this.data = await this.statusServices.getStatus();
    console.log(this.data);
    this.data = this.data.map((item) => ({
      ...item,
      Status: item.servicefe_status ? 'Online' : 'Offline',
      LastConnection: item.servicefe_lastconn,
      OsfInfo: item.servicefe_osinfo,
      TenantId: item.servicefe_tenantrnc,
      IP: item.servicefe_ip,
      Hostname: item.servicefe_hostname
    }));
    this.columns = [
      {
        name: 'id',
        field: 'Id',
        type: 'hidden'
      },
      {
        name: 'Hostname',
        field: 'Hostname',
        type: 'text'
      },
      {
        name: 'IP',
        field: 'IP',
        type: 'text'
      },

      {
        name: 'Estado',
        field: 'Status',
        type: 'text'
      },
      {
        name: 'RNC',
        field: 'TenantId',
        type: 'text'
      },
      {
        name: 'Sistema Operativo',
        field: 'OsfInfo',
        type: 'text'
      },

      {
        name: 'Ultima Conexión',
        field: 'LastConnection',
        type: 'date'
      },

    ];
  }
}

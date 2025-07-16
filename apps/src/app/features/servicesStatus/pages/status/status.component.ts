import { Component } from '@angular/core';
import { DataGridComponent } from '../../../../shared/component/data-grid/data-grid.component';
import { Column } from '../../../../shared/component/data-grid/interfaces/column';
import { ServiceStatus } from '../../interfaces/interface';

@Component({
  selector: 'app-status',
  imports: [DataGridComponent],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})
export class StatusComponent {
  columns: Column[] = [
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
      name: 'LastConnection',
      field: 'LastConnection',
      type: 'date'
    },
    {
      name: 'Status',
      field: 'Status',
      type: 'text'
    },
    {
      name: 'OsfInfo',
      field: 'OsfInfo',
      type: 'text'
    },
    {
      name: 'TenantId',
      field: 'TenantId',
      type: 'text'
    },

  ];

  filterFields: string[] = ['IP', 'Hostname', 'Status', 'OsfInfo'];


  data: ServiceStatus[] = [
    {
      Id: 1,
      TenantId: 1,
      IP: '192.168.1.1',
      Hostname: 'localhost',
      LastConnection: new Date(),
      Status: 'Online',
      OsfInfo: 'OSF Info'
    },
    {
      Id: 2,
      TenantId: 2,
      IP: '192.168.1.2',
      Hostname: 'localhost',
      LastConnection: new Date(),
      Status: 'Offline',
      OsfInfo: 'OSF Info'
    }
  ];



}

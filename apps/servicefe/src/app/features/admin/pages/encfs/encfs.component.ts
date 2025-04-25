import { Component, OnInit } from '@angular/core';
import { Column } from '../../../../shared/component/data-grid/interfaces/column';
import { DataGridComponent } from '../../../../shared/component/data-grid/data-grid.component';
import { Ncf } from '../../../encf/interfaces/encf';
import { lastValueFrom } from 'rxjs';
import { EncfService } from '../../../encf/services/encf-service.service';

@Component({
  selector: 'app-encfs',
  imports: [DataGridComponent],
  templateUrl: './encfs.component.html',
  styles: ``
})
export class EncfsComponent implements OnInit {

  constructor(private encfService: EncfService){}

  columns!: Column[];
  encfs!: Ncf[];

  async ngOnInit() {

    this.encfs = await lastValueFrom(this.encfService.getAllEncfs());

    this.columns = [
      {
        name: 'id',
        field: 'transncf_id',
        type: 'hidden'
      },
      {
        name: 'E-NCF',
        field: 'transncf_encf',
        type: 'text'
      },
      {
        name: 'ITBIS',
        field: 'transncf_itbis',
        type: 'numeric'
      },
      {
        name: 'Monto total',
        field: 'transncf_montototal',
        type: 'numeric'
      },
      {
        name: 'Razón social',
        field: 'tenant_name',
        type: 'text'
      },
      {
        name: 'RNC Empresa',
        field: 'tenant_cedrnc',
        type: 'text'
      },
      {
        name: 'Estado',
        field: 'transncf_status',
        type: 'text'
      },
      {
        name: 'Fecha',
        field: 'transncf_fechaemision',
        type: 'date'
      }
    ];
  }

}

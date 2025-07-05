import { Component, OnInit } from '@angular/core';
import { Column } from '../../../../shared/component/data-grid/interfaces/column';
import { DataGridComponent } from '../../../../shared/component/data-grid/data-grid.component';
import { Datum, Ncf } from '../../../encf/interfaces/encf';
import { lastValueFrom } from 'rxjs';
import { EncfService } from '../../../encf/services/encf-service.service';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-encfs',
  imports: [DataGridComponent],
  templateUrl: './encfs.component.html',
  styles: ``
})
export class EncfsComponent implements OnInit {

  constructor(private encfService: EncfService) { }

  columns!: Column[];
  encfs: Datum[] = [];
  encfWholeData!: Ncf;
  totalRecords!: number;
  filterFields: string[] = ['transncf_encf', 'transncf_status', 'tenant_name', 'tenant_cedrnc', 'transncf_rnccomprador']

  async ngOnInit() {

    this.encfWholeData = await this.encfService.getAllEncfs(10, 1);
    this.encfs = this.encfWholeData.data;
    this.totalRecords = this.encfWholeData.total;

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

  async onChangePage(event: TableLazyLoadEvent) {
    const page: number = (event.first! / event.rows!) + 1;
    const perPage: number = event.rows!;

    console.log(event)

    this.encfWholeData = await this.encfService.getAllEncfs(perPage, page, event);
    this.encfs = this.encfWholeData.data;
    this.totalRecords = this.encfWholeData.total;
  }

}

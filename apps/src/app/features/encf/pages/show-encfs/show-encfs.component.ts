import { Component, OnInit } from '@angular/core';
import { DataGridComponent } from '../../../../shared/component/data-grid/data-grid.component';
import { Column } from '../../../../shared/component/data-grid/interfaces/column';
import { lastValueFrom } from 'rxjs';
import { EncfService } from '../../services/encf-service.service';
import { Ncf } from '../../interfaces/encf';

@Component({
  selector: 'app-show-encfs',
  imports: [DataGridComponent],
  templateUrl: './show-encfs.component.html',
  styles: ``
})
export class ShowEncfsComponent implements OnInit {
  columns: Column[] = [];
  Encfs!: Ncf[];

  constructor(protected encfService: EncfService) { }

  async ngOnInit() {

    this.Encfs = await lastValueFrom(this.encfService.getEncfs());
    console.log(this.Encfs)

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
        name: 'RNC Comprador',
        field: 'transncf_rnccomprador',
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

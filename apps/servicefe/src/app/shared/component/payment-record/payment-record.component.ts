import { Component, OnInit } from '@angular/core';
import { Column } from '../data-grid/interfaces/column';
import { DataGridComponent } from '../data-grid/data-grid.component';

@Component({
  selector: 'app-payment-record',
  imports: [DataGridComponent],
  templateUrl: './payment-record.component.html',
  styles: ``
})
export class PaymentRecordComponent implements OnInit {
  public columns: Column[] = [];
  public data: any[] = [];

  ngOnInit(): void {
    this.columns = [
      {
        name: 'id',
        field: 'billing_id',
        type: 'hidden'
      },
      {
        name: 'Fecha',
        field: 'billing_fecha',
        type: 'date'
      },
      {
        name: 'Descripción',
        field: 'billing_descripcion',
        type: 'numeric'
      },
      {
        name: 'Monto',
        field: 'billing_monto',
        type: 'numeric'
      },
      {
        name: 'Estado',
        field: 'billing_estado',
        type: 'numeric'
      },
      {
        name: 'Factura',
        field: 'billing_factura',
        type: 'text'
      },
    ];
  }

}

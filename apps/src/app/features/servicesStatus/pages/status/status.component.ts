import { Component } from '@angular/core';
import { DataGridComponent } from '../../../../shared/component/data-grid/data-grid.component';
import { Column } from '../../../../shared/component/data-grid/interfaces/column';

@Component({
  selector: 'app-status',
  imports: [DataGridComponent],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})
export class StatusComponent {
  columns: Column[] = [];
 


}

import { Component, OnInit, signal } from '@angular/core';
import { DataGridComponent } from '../../../../shared/component/data-grid/data-grid.component';
import { Column } from '../../../../shared/component/data-grid/interfaces/column';
import { EncfService } from '../../services/encf-service.service';
import { Datum, Ncf } from '../../interfaces/encf';
import { TableLazyLoadEvent, TablePageEvent } from 'primeng/table';
import { OnExportEmit } from '../../../../shared/interfaces/on-export-emit';
import { LocalStorageService } from '../../../../shared/service/local-storage-service.service';
import { PdfExportService } from '../../../../shared/service/pdf-export.service';

@Component({
  selector: 'app-show-encfs',
  imports: [DataGridComponent],
  templateUrl: './show-encfs.component.html',
  styles: ``
})
export class ShowEncfsComponent implements OnInit {
  columns: Column[] = [];
  encfs: Datum[] = [];
  encfWholeData!: Ncf;
  filterFields: string[] = ['transncf_encf', 'transncf_status', 'tenant_name', 'tenant_cedrnc', 'transncf_rnccomprador']
  totalRecords!: number;

  constructor(protected encfService: EncfService, private local: LocalStorageService, private pdfExport: PdfExportService) { }

  async ngOnInit() {

    this.encfWholeData = await this.encfService.getEncfs(10, 1)
    this.encfs = this.encfWholeData.data
    this.totalRecords = this.encfWholeData.total

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

  async onChangePage(event: TableLazyLoadEvent) {
    const page: number = (event.first! / event.rows!) + 1;
    const perPage: number = event.rows!;

    this.encfWholeData = await this.encfService.getEncfs(perPage, page, event);
    this.totalRecords = this.encfWholeData.total;
    this.encfs = this.encfWholeData.data;
  }

  onExport(exportData: OnExportEmit) {
    switch (exportData.type) {
      case 'CSV':
        this.exportCSV(exportData.event!);
        break;
      case 'PDF':
        this.exportPDF(exportData.event!);
        break;
    }
  }

  async exportCSV(lazyData: TableLazyLoadEvent) {
    const visibleColumns = this.columns.filter(col => col.type !== 'hidden');
    const headers = visibleColumns.map(col => col.name);

    const data = await this.encfService.getEncfExportData(this.local.tenantId, lazyData);

    const dataRows = data.map((row: any) =>
      visibleColumns.map(col => {
        const value = row[col.field];

        switch (col.type) {
          case 'numeric':
            return `"${value?.toLocaleString() || ''}"`;
          case 'date':
            return `"${new Date(value).toLocaleDateString() || ''}"`;
          default:
            return `"${(value ?? '').toString().replace(/"/g, '""')}"`;
        }
      }).join(',')
    );

    const csvContent = [
      headers.join(','),
      ...dataRows
    ].join('\n');

    this.downloadCSV(csvContent, 'export.csv');
  }

  private downloadCSV(content: string, fileName: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async exportPDF(lazyData: TableLazyLoadEvent) {
    const data = await this.encfService.getEncfExportData(this.local.tenantId, lazyData);
    this.pdfExport.exportToPDF(
      data!,
      this.columns,
      'E-NCF Report',
      'encf_export'
    );
  }
}

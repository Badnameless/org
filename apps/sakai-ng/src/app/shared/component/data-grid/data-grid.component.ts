import { Component, computed, ContentChild, effect, ElementRef, input, Input, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, FilterMetadata, MenuItem, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableFilterEvent, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { CustomerService } from '../../../features/service/customer.service';
import { ProductService } from '../../../features/crud/services/product.service';
import { Column } from './interfaces/column';
import { MessageModule } from 'primeng/message';
import { lastValueFrom, Observable } from 'rxjs';
import { PdfExportService } from '../../service/pdf-export.service';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PopoverModule } from 'primeng/popover';
import { LoaderComponent } from '../loader/loader.component';
import { NotFoundMessageComponent } from '../not-found-message/not-found-message.component';
import { filterNameMap } from '../../utils/FilterNameMap';

interface expandedRows {
  [key: string]: boolean;
}

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [
    TableModule,
    MultiSelectModule,
    SelectModule,
    InputIconModule,
    TagModule,
    InputTextModule,
    SliderModule,
    ProgressBarModule,
    ToggleButtonModule,
    ToastModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    RatingModule,
    RippleModule,
    IconFieldModule,
    MessageModule,
    ConfirmDialogModule,
    MenuModule,
    DialogModule,
    PopoverModule,
    LoaderComponent,
    NotFoundMessageComponent
  ],
  templateUrl: 'data-grid.component.html',
  styles: `
        .p-datatable-frozen-tbody {
            font-weight: bold;
        }

        .p-datatable-scrollable .p-frozen-column {
            font-weight: bold;
        }
    `,
  providers: [ConfirmationService, MessageService, CustomerService, ProductService, DialogService]
})
export class DataGridComponent implements OnInit {

  constructor(public confirm: ConfirmationService,
    private msg: MessageService,
    private pdfExport: PdfExportService) {

    effect(() => {
      if (this.data()!.length < 1) {
        setTimeout(() => {
          this.timeout.set(true)
        }, 1000);
      }
    })
  }

  exportItems!: MenuItem[]
  selectedRows!: any[];
  timeout = signal<boolean>(false);
  showAddDialog: boolean = false;
  data = input<any[] | null>();

  filters = signal<{
    [s: string]: FilterMetadata | undefined;
  } | undefined>(undefined);

  readonly activeFilters = computed(() => {
    const current = this.filters();
    if (!current) return [];

    const fieldMap = new Map();

    this.columns.forEach(column => {
      fieldMap.set(column.field, column.name)
    })

    return Object.entries(current)
      .flatMap(([field, filterArray]) => {
        if (!Array.isArray(filterArray)) return [];

        return filterArray
          .filter(f => {
            console.log(f.matchMode);
            const val = f?.value;
            if (Array.isArray(val)) return val.length > 0;
            return val !== undefined && val !== null && val !== '';
          })
          .map(f => (
            {
              field,
              fieldName: fieldMap.get(field),
              value: f.value,
              matchMode: filterNameMap.get(f.matchMode)
            }));
      });
  });

  @Input()
  columns: Column[] = [];

  @Input()
  XMLExportable: boolean = false;

  @Input()
  isCrud: boolean = false;

  @Input()
  exportable: boolean = false;

  @Input()
  dataKey: string = '';

  @Input()
  addFormRef: DynamicDialogRef | undefined;

  @Input()
  fieldToSort!: string;

  @Input()
  deleteFunction!: (id: number[]) => Observable<any>

  @Input()
  showAddForm!: (data?: any) => void

  @Input()
  filterFields: string[] = [];

  @Input()
  isBasicTable: boolean = false;

  @ViewChild('dt1') dt1!: Table;
  @ContentChild('addForm') addFormTemplate!: TemplateRef<any>;

  ngOnInit() {
    setTimeout(() => {
      if (this.data()!.length < 1) {
        this.timeout.set(true);
      }
    }, 15000);

    this.exportItems = [
      {
        label: 'CSV',
        command: () => this.exportCSV()
      },
      {
        label: 'PDF',
        command: () => this.exportPDF()
      },
    ];

    if (this.XMLExportable) {
      this.exportItems.push(
        {
          label: 'XML',
        }
      )
    }
  }

  exportCSV() {
    if (!this.dt1 || !this.data) return;

    const visibleColumns = this.columns.filter(col => col.type !== 'hidden');

    const headers = visibleColumns.map(col => col.name);

    const filteredValue = this.dt1.filteredValue!;

    const dataRows = filteredValue ? filteredValue : this.data();

    const csvContent = [
      headers.join(','),
      ...dataRows!.map(row =>
        visibleColumns.map(col => {
          let value = row[col.field];

          switch (col.type) {
            case 'numeric':
              return `"${value?.toLocaleString() || ''}"`;
            case 'date':
              return `"${new Date(value).toLocaleDateString() || ''}"`;
            default:
              return `"${(value || '').toString().replace(/"/g, '""')}"`;
          }
        }).join(',')
      )
    ].join('\n');

    this.downloadCSV(csvContent, 'export.csv');
  }

  exportPDF() {
    if (!this.data) return;

    const data = this.dt1.filteredValue || this.data();
    this.pdfExport.exportToPDF(
      data!,
      this.columns,
      'E-NCF Report',
      'encf_export'
    );
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

  expandAll() {
    // if (!this.isExpanded) {
    //     this.products.forEach((product) => (product && product.name ? (this.expandedRows[product.name] = true) : ''));
    // } else {
    //     this.expandedRows = {};
    // }
    // this.isExpanded = !this.isExpanded;
  }

  formatCurrency(value: number) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
  }

  getSeverity(status: number) {
    switch (status) {
      case 1:
        return 'success';

      case 2:
        return 'danger';

      case 3:
        return 'warn'

      case 4:
        return 'info';

      default:
        return 'info';
    }
  }

  getStatus(status: number): string {
    switch (status) {
      case 1:
        return 'Aceptado'
      case 2:
        return 'Rechazado'
      case 3:
        return 'Pendiente'
      case 4:
        return 'Aceptado Condicional'

      default:
        return 'Error'
    }
  }

  calculateCustomerTotal(name: string) {
    let total = 0;
    return total;
  }

  async delete(id?: number) {

    let ids: number[] = [];

    if (id) {
      ids.push(id)
    } else if (this.selectedRows) {
      this.selectedRows.map(row => {
        ids.push(row[this.dataKey])
      })
    }

    console.log(await lastValueFrom(this.deleteFunction(ids)))
    window.location.reload();
  }

  confirmDelete(id?: number) {
    if (!this.selectedRows && !id) {
      this.msg.add({ sticky: true, severity: 'error', summary: 'Error al borrar', detail: 'No se seleccionaron campos para borrar' })
      return;
    }

    this.confirm.confirm({
      message: `Estas seguro de borrar este contenido?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => this.delete(id),
    });
  }

  closeDialog() {
    this.showAddDialog = false;
  }

  onFilter(event: TableFilterEvent) {
    this.filters.set(event.filters!);
  }

  onRemoveFilter(filteredColumn: string) {
    let filters = Object.entries(this.dt1.filters);
    filters = filters.filter(filter => filter[0] != filteredColumn )
    const newTableFilters = Object.fromEntries(filters);
    this.dt1.filters = newTableFilters;
    console.log(this.dt1.filters);
  }
}

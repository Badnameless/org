import { Component, computed, ContentChild, effect, ElementRef, EventEmitter, input, Input, OnInit, Output, signal, TemplateRef, ViewChild } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, FilterMetadata, MenuItem, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { ColumnFilter, Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
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
import { CustomerService } from '../../../../../../../../apps/sakai-ng/src/app/features/service/customer.service';
import { ProductService } from '../../../../../../../../apps/sakai-ng/src/app/features/crud/services/product.service';
import { Column } from './interfaces/column';
import { MessageModule } from 'primeng/message';
import { PdfExportService } from '../../../../../../../../apps/sakai-ng/src/app/services/pdf-export.service';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PopoverModule } from 'primeng/popover';
import { LoaderComponent } from '@org/shared-template';
import { NotFoundMessageComponent } from '@org/shared-template';
import { FilterNameMap } from '@org/shared-template';
import { FluidModule } from 'primeng/fluid';
import { OnExportEmit } from '../../../../../../../../apps/sakai-ng/src/app/shared/interfaces/on-export-emit';
import { Filter } from './interfaces/filters';
import { DynamicDataFilterPipe } from '@org/shared-template';


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
    NotFoundMessageComponent,
    FluidModule,
    DynamicDataFilterPipe,
    LoaderComponent
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
  styleUrl: 'data-grid.component.css',
  providers: [ConfirmationService, MessageService, CustomerService, ProductService, DialogService]
})
export class DataGridComponent implements OnInit {

  constructor(public confirm: ConfirmationService,
    private msg: MessageService,
    private pdfExport: PdfExportService,
  ) {
    effect(() => {
      this.getFilters();

      if (this.data()!.length < 1) {
        setTimeout(() => {
          this.timeout.set(true)
        }, 10000);
      }
    })
  }

  exportItems!: MenuItem[]
  selectedRows!: any[];
  timeout = signal<boolean>(false);
  showAddDialog: boolean = false;
  data = input<any[] | null>();
  isLazy = input<boolean>(false);
  isLoading = signal<boolean>(true);

  filters = signal<{ [s: string]: FilterMetadata | FilterMetadata[] | undefined } | undefined>({});

  readonly activeFilters = signal<Filter[]>([]);

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
  deleteFunction!: (id: number[]) => Promise<Error | void>

  @Input()
  showAddForm!: (data?: any) => void

  @Input()
  filterFields: string[] = [];

  @Input()
  isBasicTable: boolean = false;

  @Input()
  totalRecords!: number;

  lazyEvent: TableLazyLoadEvent | null = null;

  @Output() onChangePage = new EventEmitter();
  @Output() onExport = new EventEmitter<OnExportEmit>();

  @ViewChild('dt1') dt1!: Table;
  @ContentChild('addForm') addFormTemplate!: TemplateRef<any>;
  @ViewChild('ColumnFilter') columnFilter!: ColumnFilter;
  @ViewChild('') filterbutton!: ElementRef;

  ngOnInit() {
    this.getFilters();

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

  onPage(event: TableLazyLoadEvent | null) {
    this.lazyEvent = event;
    this.onChangePage.emit(event);
    this.filters.set(event?.filters)
  }

  getFilters() {
    const rawFilters = this.filters();
    let filters: Filter[] = [{
      filters: [],
      name: ''
    }];

    for (const key in rawFilters) {
      const filterArray = rawFilters[key];
      if (Array.isArray(filterArray)) {
        const hasValue = filterArray.find(filter => filter.value != null)
        if (hasValue) {
          const filter = {
            filters: filterArray.map(filter => ({
              ...filter,
              matchMode: FilterNameMap.get(filter.matchMode!),
              type: this.columns.find(column => column.field === key)?.type

            })),
            name: this.columns.find(column => column.field == key)?.name
          }
          filters.push(filter); // Spread the array
        }
      }
    }

    this.activeFilters.set(filters)

    return this.activeFilters();
  }

  exportCSV() {
    if (!this.dt1 || !this.data) return;

    if (this.isLazy()) {
      this.onExport.emit({
        type: 'CSV',
        event: this.lazyEvent
      });
    } else {
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
  }

  exportPDF() {
    if (!this.data) return;

    if (this.isLazy()) {
      this.onExport.emit({
        type: 'PDF',
        event: this.lazyEvent
      });
    } else {
      const data = this.dt1.filteredValue || this.data();
      this.pdfExport.exportToPDF(
        data!,
        this.columns,
        'E-NCF Report',
        'encf_export'
      );
    }
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

    const response: Error | void = await this.deleteFunction(ids)

    if (response instanceof Error) {
      switch (response.message) {
        case 'selfDeleting':
          this.msg.add({ sticky: true, severity: 'error', summary: 'Error al borrar', detail: 'Se ha intentado eliminar al usuario actual.' })
          break;
      }
    }
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
}

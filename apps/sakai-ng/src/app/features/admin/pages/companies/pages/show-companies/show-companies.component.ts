import { Component } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { DataGridComponent } from '../../../../../../shared/component/data-grid/data-grid.component';
import { Column } from '../../../../../../shared/component/data-grid/interfaces/column';
import { Company } from '../../interfaces/company';
import { lastValueFrom } from 'rxjs';
import { UpdateAddCompanyComponent } from '../../UpdateAddcompany.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-show-companies',
  imports: [DataGridComponent, UpdateAddCompanyComponent],
  templateUrl: './show-companies.component.html',
  styles: ``,
  providers: [DialogService]
})

export class ShowCompaniesComponent {
  constructor(protected companyService: CompanyService, private dialogService: DialogService) { }
  columns: Column[] = [];
  companies!: Company[];
  filterFields: string[] = ['tenant_name', 'tenant_cedrnc'];

  addFormref!: DynamicDialogRef;

  async ngOnInit() {
    await this.loadCompanies();
  }

  show(company?: Company){
    if(company){
      const { tenant_name, tenant_cedrnc, plan_name, tenant_id, plan_id } = company
      const reducedCompany = { tenant_name, tenant_cedrnc, plan_name, tenant_id, plan_id }

      this.addFormref = this.dialogService.open(UpdateAddCompanyComponent,
        {
          header: 'Modificar una compañia',
          closable: true,
          width: '20vw',
          inputValues: reducedCompany
        })
    }else{
      this.addFormref = this.dialogService.open(UpdateAddCompanyComponent,
        {
          header: 'Agregar una compañia',
          closable: true,
          width: '20vw',
        })
    }
  }

  async loadCompanies() {
    this.companies = await this.companyService.getCompanies();

    this.columns = [
      {
        name: 'plan_name',
        field: 'plan_name',
        type: 'hidden'
      },
      {
        name: 'plan_id',
        field: 'plan_id',
        type: 'hidden'
      },
      {
        name: 'id',
        field: 'tenant_id',
        type: 'hidden'
      },
      {
        name: 'Empresa',
        field: 'tenant_name',
        type: 'text'
      },
      {
        name: 'RNC/Cedula',
        field: 'tenant_cedrnc',
        type: 'text'
      },
    ];
  }
}

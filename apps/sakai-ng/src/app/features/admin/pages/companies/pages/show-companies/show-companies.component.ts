import { Component, computed } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { DataGridComponent } from '../../../../../../../../../../libs/shared-template/src/lib/shared-template/shared/component/data-grid/data-grid.component';
import { Column } from '../../../../../../../../../../libs/shared-template/src/lib/shared-template/shared/component/data-grid/interfaces/column';
import { Company } from '../../interfaces/company';
import { UpdateAddCompanyComponent } from '../../UpdateAddcompany.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PlanService } from '../../../plans/services/plan.service';

@Component({
  selector: 'app-show-companies',
  imports: [DataGridComponent, UpdateAddCompanyComponent],
  templateUrl: './show-companies.component.html',
  styles: ``,
  providers: [DialogService]
})

export class ShowCompaniesComponent {
  constructor(protected companyService: CompanyService, private dialogService: DialogService, private planService: PlanService) {
    companyService.getCompanies();
    planService.getPlans();
  }

  columns: Column[] = [];
  companies = computed<Company[]>(() => this.companyService.companies());
  filterFields: string[] = ['tenant_name', 'tenant_cedrnc'];

  addFormref!: DynamicDialogRef;

  async ngOnInit() {
    await this.loadCompanies();
  }

  show(company?: Company) {
    console.log(this.companies())
    if (company) {
      const { tenant_name, tenant_cedrnc, plan_name, tenant_id, plan_id } = company
      const reducedCompany = { tenant_name, tenant_cedrnc, plan_name, tenant_id, plan_id }

      this.addFormref = this.dialogService.open(UpdateAddCompanyComponent,
        {
          header: 'Modificar una compañia',
          closable: true,
          modal: true,
          width: '20vw',
          inputValues: reducedCompany,
          breakpoints: {
            '545px': '85vw',
          },
        })
    } else {
      this.addFormref = this.dialogService.open(UpdateAddCompanyComponent,
        {
          header: 'Agregar una compañia',
          closable: true,
          modal: true,
          width: '20vw',
          breakpoints: {
            '545px': '85vw',
          },
        })
    }
  }

  async loadCompanies() {
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

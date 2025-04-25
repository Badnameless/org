import { Component } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { DataGridComponent } from '../../../../../../shared/component/data-grid/data-grid.component';
import { Column } from '../../../../../../shared/component/data-grid/interfaces/column';
import { Company } from '../../interfaces/company';
import { lastValueFrom } from 'rxjs';
import { AddCompanyComponent } from '../../Addcompany.component';

@Component({
  selector: 'app-show-companies',
  imports: [DataGridComponent, AddCompanyComponent],
  templateUrl: './show-companies.component.html',
  styles: ``
})
export class ShowCompaniesComponent {
  constructor(protected companyService: CompanyService) { }
  columns: Column[] = [];
  companies!: Company[];

  async ngOnInit() {
    await this.loadCompanies();
  }

  async loadCompanies() {
    this.companies = await lastValueFrom(this.companyService.getCompanies());

    this.columns = [
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

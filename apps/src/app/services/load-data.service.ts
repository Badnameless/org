import { Injectable, OnInit } from '@angular/core';
import { CompanyService } from '../features/admin/pages/companies/services/company.service';
import { EncfService } from '../features/encf/services/encf-service.service';
import { PlanService } from '../features/admin/pages/plans/services/plan.service';
import { UserService } from '../features/admin/pages/users/services/user.service';
import { forkJoin, from } from 'rxjs';
import { NotificationService } from '../shared/service/notification.service';

@Injectable({
  providedIn: 'root'
})
export class LoadDataService{

  constructor(
    private companyService: CompanyService,
    private encfService: EncfService,
    private planService: PlanService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  async loadUserData(){
    forkJoin([
      from(await this.encfService.getEncfs())
    ]).subscribe();
  }

  async loadAdminData(){
    forkJoin([
      from(await this.companyService.getCompanies()),
      from(await this.planService.getPlans()),
      from(await this.userService.getUsers()),
      from(await this.encfService.getEncfs()),
      from(await this.encfService.getAllEncfs()),
      from(this.notificationService.getNotifications())
    ]).subscribe();
  }
}

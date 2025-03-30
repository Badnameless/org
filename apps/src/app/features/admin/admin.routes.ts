import { Routes } from "@angular/router";
import { CompanyComponent } from "./pages/companies/company.component";
import { PlanComponent } from "./pages/plans/plan.component";
import { UserComponent } from "./pages/users/user.component";

export default [
  {path: 'companies', component: CompanyComponent},
  {path: 'plans', component: PlanComponent},
  {path: 'users', component: UserComponent}
] as Routes

import { Routes } from "@angular/router";
import { ShowCompaniesComponent } from "./pages/companies/pages/show-companies/show-companies.component";
import { ShowPlansComponent } from "./pages/plans/pages/show-plans/show-plans.component";
import { ShowUsersComponent } from "./pages/users/pages/show-users/show-users.component";
import { EncfsComponent } from "./pages/encfs/encfs.component";

export default [
  {path: 'companies', component: ShowCompaniesComponent},
  {path: 'plans', component: ShowPlansComponent},
  {path: 'users', component: ShowUsersComponent},
  {path: 'encfs', component: EncfsComponent}

] as Routes

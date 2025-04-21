import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../../../../auth/interfaces/user';
import { Column } from '../../../../../../shared/component/data-grid/interfaces/column';
import { lastValueFrom } from 'rxjs';
import { AddUserComponent } from "../../Adduser.component";
import { DataGridComponent } from '../../../../../../shared/component/data-grid/data-grid.component';

@Component({
  selector: 'app-show-users',
  imports: [AddUserComponent, DataGridComponent],
  templateUrl: './show-users.component.html',
  styles: ``
})
export class ShowUsersComponent {
  constructor(protected userService: UserService) { }
  columns: Column[] = [];
  users!: User[];

  async ngOnInit() {
    await this.loadCompanies();
  }

  async loadCompanies() {
    this.users = await lastValueFrom(this.userService.getUsers());

    this.columns = [
      {
        name: 'id',
        field: 'user_id',
        type: 'hidden'
      },
      {
        name: 'Nombre',
        field: 'user_name',
        type: 'text'
      },
      {
        name: 'E-mail',
        field: 'user_email',
        type: 'text'
      },
    ];
  }
}

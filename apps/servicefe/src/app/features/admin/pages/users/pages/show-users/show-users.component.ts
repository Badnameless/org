import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../../../../auth/interfaces/user';
import { Column } from '../../../../../../shared/component/data-grid/interfaces/column';
import { lastValueFrom } from 'rxjs';
import { UpdateAddUserComponent } from "../../UpdateAdduser.component";
import { DataGridComponent } from '../../../../../../shared/component/data-grid/data-grid.component';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-show-users',
  imports: [UpdateAddUserComponent, DataGridComponent],
  templateUrl: './show-users.component.html',
  styles: ``,
  providers: [DialogService]
})
export class ShowUsersComponent {
  constructor(protected userService: UserService, private dialogService: DialogService) { }
  columns: Column[] = [];
  users!: User[];
  addFormref!: DynamicDialogRef;
  filterFields: string[] = ['user_name', 'user_email'];

  async ngOnInit() {
    await this.loadUsers();
  }

  show(user?: User) {
    if (user) {
      const { user_name, user_email, user_id, tenants } = user
      const filteredUser = { user_name, user_email, user_id, tenants }

      this.addFormref = this.dialogService.open(UpdateAddUserComponent,
        {
          header: 'Modificar un usuario',
          closable: true,
          width: '20vw',
          inputValues: filteredUser
        })
    } else {
      this.addFormref = this.dialogService.open(UpdateAddUserComponent,
        {
          header: 'Agregar un usuario',
          closable: true,
          width: '20vw',
        })
    }

  }

  async loadUsers() {
    this.users = await this.userService.getUsers();

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

import { Component, OnInit } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { LoadDataService } from '../../services/load-data.service';
import { User } from '../auth/interfaces/user';
import { Router } from '@angular/router';


@Component({
  selector: 'app-loading-page',
  imports: [SvgIconComponent],
  templateUrl: './loading-page.component.html',
  styles: ``,
  providers: [LoadDataService]
})
export class LoadingPageComponent implements OnInit{
  public iconClass: string = 'w-28'

  constructor(
    private loadService: LoadDataService,
    private router: Router
  ){}

  async ngOnInit() {
    const user: User = JSON.parse(localStorage.getItem('user')!);

    if(user.roles.name[0] === 'admin'){
      await this.loadService.loadAdminData();
    }else{
      await this.loadService.loadUserData();
    }

    this.router.navigate(['/'])
  }
}

import { Component, OnInit } from '@angular/core';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { AppFloatingConfigurator } from "../../../../../shared/component/app.floatingconfigurator";
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-sucess',
  imports: [PanelModule, MessageModule, AppFloatingConfigurator],
  templateUrl: './verify-sucess.component.html',
  styles: ``
})
export class VerifySucessComponent implements OnInit {

  constructor(private router:Router){}

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['auth/login'])
    }, 3000);
  }
}

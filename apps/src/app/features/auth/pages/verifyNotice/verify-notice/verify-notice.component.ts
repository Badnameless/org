import { Component } from '@angular/core';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { AppFloatingConfigurator } from '../../../../..//shared/component/app.floatingconfigurator';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/auth.service';
import { RegisterService } from '../../register/services/register.service';
import { User } from '../../../interfaces/user';
import { resendResponse } from './interfaces/ResendResponse';
import { waitForAsync } from '@angular/core/testing';
import { delay } from 'rxjs';


@Component({
  selector: 'app-verify-notice',
  imports: [MessageModule, CommonModule, AppFloatingConfigurator, PanelModule, ButtonModule],
  templateUrl: './verify-notice.component.html',
  styles: ''
})
export class VerifyNoticeComponent {

  public resendResponse?: resendResponse;
  public currentUser?: User;
  public resendCooldown: boolean = false;
  public isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private registerService: RegisterService
  ) {
    this.currentUser = authService.currentUser;
  }

  async setResendCooldown() {
    setTimeout(() => {
      this.resendCooldown = false
    }, 30000);
  }

  onResend() {
    this.isLoading = true;

    this.registerService.resendVerification()
    .subscribe(res => {
      this.resendResponse = res;
      this.isLoading = false;

      this.resendCooldown = true
      if(this.resendResponse.message !== 'Email has been sent') return;

      this.setResendCooldown();
    });
  }

}

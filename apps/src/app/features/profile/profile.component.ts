import { ValidatorService } from './../../services/validator.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { Tenant, User } from '../auth/interfaces/user';
import { MessageService } from 'primeng/api';
import { ProfileService } from './services/profile.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { Token } from '../auth/interfaces/token';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../auth/services/auth.service';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpService } from '../../services/http.service';
import { SelectModule } from 'primeng/select';
import { EmailValidatorService } from '../admin/pages/users/validators/email-validator.service';

@Component({
  selector: 'app-profile',
  imports: [ImageModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    MessageModule,
    ReactiveFormsModule,
    ToastModule,
    DialogModule,
    CommonModule,
    FileUploadModule,
    SelectModule
  ],
  templateUrl: './profile.component.html',
  styles: ``,
  providers: [MessageService, ProfileService]
})
export class ProfileComponent implements OnInit {

  uploadedPhoto!: File;

  public nameFormGroup!: FormGroup;
  public emailFormGroup!: FormGroup;
  public tenantFormGroup!: FormGroup;
  public emailControl = new FormControl({ value: '', disabled: true });

  public user!: User;
  public token!: Token;
  public default_tenant!: Tenant;

  public emailLoading: boolean = false;

  public emailDialogVisible: boolean = false;
  public photoDialogVisible: boolean = false;

  public userImgPath!: string;

  constructor(private fb: FormBuilder,
    private message: MessageService,
    private validatorService: ValidatorService,
    private profileService: ProfileService,
    private authService: AuthService,
    private httpService: HttpService,
    private emailValidator: EmailValidatorService
  ) {

    this.nameFormGroup = fb.group({
      user_name: ['', [Validators.required, Validators.pattern(validatorService.FullnamePattern)]]
    })

    this.emailFormGroup = fb.group(
      {
        new_email: [
          '',
          [Validators.required, Validators.pattern(validatorService.emailPattern)],
          [this.emailValidator]
        ],
        confirm_email: [
          '',
          [Validators.required, Validators.pattern(validatorService.emailPattern)]
        ]
      },
      {
        validators: validatorService.compareTwoFields('new_email', 'confirm_email')
      }
    );

    this.tenantFormGroup = fb.group({
      tenant: JSON.parse(localStorage.getItem('default_tenant')!)
    });
  }



  async ngOnInit() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    this.token = JSON.parse(localStorage.getItem('token')!);

    // Verificar si hay una update para cargar desde la DB o el localstorage
    if (localStorage.getItem('isUpdated')) {
      this.user = await lastValueFrom(this.authService.storeAuthUser(this.token))
      localStorage.removeItem('isUpdated')
    } else {
      this.user = JSON.parse(localStorage.getItem('user')!);
    }

    // seteando la data del usuario en los textbox
    this.nameFormGroup.controls['user_name'].setValue(this.user.user_name);
    this.emailControl.setValue(this.user.user_email)

    this.default_tenant = JSON.parse(localStorage.getItem('default_tenant')!)
    const foundTenant = this.user.tenants.find(tenant => tenant.tenant_id === this.default_tenant.tenant_id);
    this.tenantFormGroup.controls['tenant'].setValue(foundTenant);

    // Si el usuario no tiene una imagen se le pone un placeholder
    if (this.user.user_photoUrl) {
      this.userImgPath = `${this.httpService.API_URL}/user/get_photo/${this.user.user_photoUrl}`;
    } else {
      this.userImgPath = 'images/user.png';
    }
  }

  handleVisibilityChange = () => {
    if (!document.hidden) {
      this.loadUserData();
    }
  };

  async loadUserData() {
    const _token: Token = JSON.parse(localStorage.getItem('token')!);
    this.user = await lastValueFrom(this.authService.storeAuthUser(_token));
    localStorage.setItem('user', JSON.stringify(this.user));
    window.location.reload();

  }

  ngOnDestroy() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  isValidField(field: string, form: FormGroup): boolean | null {
    return this.validatorService.isValidField(form, field);
  }

  getFieldError(field: string, form: FormGroup) {
    return this.validatorService.getFieldError(form, field);
  }

  // Cambio de foto de perfil
  async onChangeAvatar(event: any) {
    const uploadedFile: File = event.files[0];

    console.log(this.token)

    await lastValueFrom(this.profileService.updatePhoto(uploadedFile, this.token));

    this.user = await lastValueFrom(this.authService.storeAuthUser(this.token));

    localStorage.setItem('user', JSON.stringify(this.user));

    this.photoDialogVisible = false;

    window.location.reload();
  }

  // Cambio de foto de nombre
  async onChangeName() {
    if (this.nameFormGroup.valid) {
      if (this.nameFormGroup.controls['user_name'].value === this.user.user_name) return;

      this.user = await lastValueFrom(this.profileService.updateName(this.nameFormGroup.value, this.token))

      localStorage.setItem('user', JSON.stringify(this.user));

      window.location.reload();

      localStorage.setItem('isUpdated', 'true')

      return;
    }

    this.message.add({ sticky: true, severity: 'error', summary: 'Error: Actualización de nombre', detail: 'Los datos proporcionados no son correctos.' });
  }

  // Cambio de foto de email
  async onChangeEmail() {
    if (this.emailFormGroup.valid) {
      this.emailLoading = true;

      await lastValueFrom(this.profileService.updateEmail(this.emailFormGroup.value, this.token))

      this.message.add({ sticky: true, severity: 'info', summary: 'Aviso: Actualización de E-mail', detail: 'Se ha enviado un correo a la nueva dirección, verifiquelo para proseguir.' });
      this.emailLoading = false;
      this.emailDialogVisible = false;
      localStorage.setItem('isUpdated', 'true')
    }
  }

  // Cambio de contrasena
  async onChangePassword() {
    await lastValueFrom(this.profileService.updatePassword(this.user.user_email, this.token))

    this.message.add({ sticky: true, severity: 'info', summary: 'Aviso: Actualización de Contraseña', detail: 'Se ha enviado un correo a la nueva dirección, verifiquelo para proseguir.' });
  }

  onChangeDefaultTenant() {
    const selectedTenant = this.tenantFormGroup.value;
    const foundTenant: Tenant | undefined = this.user.tenants.find(tenant => tenant.tenant_cedrnc === selectedTenant.tenant.tenant_cedrnc);
    localStorage.setItem('default_tenant', JSON.stringify(foundTenant))
    this.message.add({ severity: 'success', summary: 'Actualización de compañia predeterminada', detail: 'Se ha actualizado la compañia predeterminada correctamente.' });
  }
}

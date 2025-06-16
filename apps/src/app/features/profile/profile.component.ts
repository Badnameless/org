import { ValidatorService } from './../../services/validator.service';
import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { Tenant } from '../auth/interfaces/user';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProfileService } from './services/profile.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../auth/services/auth.service';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { EmailValidatorService } from '../admin/pages/users/validators/email-validator.service';
import { AvatarModule } from 'primeng/avatar';
import { TabsModule } from 'primeng/tabs';
import { FluidModule } from 'primeng/fluid';
import { TagModule } from 'primeng/tag';
import { PaymentRecordComponent } from '../../shared/component/payment-record/payment-record.component';
import { NotificationService } from '../../shared/service/notification.service';
import { Notificacion } from '../../shared/interfaces/Notificacion';
import { DateAgoPipe } from '../../shared/pipes/date-ago.pipe';
import { PaginatorModule } from 'primeng/paginator';
import { ModalTitleComponent } from '../../shared/component/modal-title/modal-title.component';
import { LoaderComponent } from '../../shared/component/loader/loader.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

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
    SelectModule,
    AvatarModule,
    TabsModule,
    FluidModule,
    TagModule,
    PaymentRecordComponent,
    DateAgoPipe,
    PaginatorModule,
    FluidModule,
    ModalTitleComponent,
    LoaderComponent,
    ConfirmDialogModule
  ],
  templateUrl: './profile.component.html',
  styles: ``,
  providers: [MessageService, ProfileService, NotificationService, ConfirmationService]
})
export class ProfileComponent implements OnInit {

  uploadedPhoto!: File;

  public userFormGroup!: FormGroup;
  public emailFormGroup!: FormGroup;

  public user = computed(() => this.authService.exposedUser());
  public token = computed(() => this.authService.exposedToken());
  public userImgPath = computed<string>(() => this.authService.userImgPath())
  public notifications = computed<Notificacion[]>(() => {
    let notifications = this.notificationService.notifications().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    return notifications.slice(0, 5)
  });

  public pagos: any[] = [];

  public default_tenant!: Tenant;

  public mouseOverAvatar: boolean = false;
  public emailDialogVisible: boolean = false;
  public editProfileVisible: boolean = false;
  public photoDialogVisible: boolean = false;
  public changeEmailLoading = signal<boolean>(false);
  public saveUserLoading = signal<boolean>(false);
  public notificationLoading = signal<boolean>(false);

  public emailControl = new FormControl({ value: '', disabled: true });


  public loading = signal<boolean>(false);



  constructor(private fb: FormBuilder,
    private message: MessageService,
    private validatorService: ValidatorService,
    private profileService: ProfileService,
    private authService: AuthService,
    private emailValidator: EmailValidatorService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService
  ) {

    effect(() => {
      this.emailControl.setValue(this.user()?.user_email!)
    })

    this.userFormGroup = fb.group({
      user_name: ['', [Validators.required, Validators.pattern(validatorService.FullnamePattern)]],
      tenant: JSON.parse(localStorage.getItem('default_tenant')!)

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
  }

  async ngOnInit() {
    // seteando la data del usuario en los textbox
    this.userFormGroup.controls['user_name'].setValue(this.user()?.user_name);

    this.default_tenant = JSON.parse(localStorage.getItem('default_tenant')!)
    const foundTenant = this.user()?.tenants.find(tenant => tenant.tenant_id === this.default_tenant.tenant_id);
    this.userFormGroup.controls['tenant'].setValue(foundTenant);
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

    await lastValueFrom(this.profileService.updatePhoto(uploadedFile, this.token()!));

    this.photoDialogVisible = false;
  }

  async onChangeUserData() {
    this.saveUserLoading.set(true);
    if (this.userFormGroup.valid) {
      if (this.userFormGroup.controls['user_name'].value != this.user()?.user_name) {
        await lastValueFrom(this.profileService.updateName(this.userFormGroup.value, this.token()!))
      }
    }

    const selectedTenant = this.userFormGroup.value;
    if (selectedTenant) {
      const foundTenant: Tenant | undefined = this.user()?.tenants.find(tenant => tenant.tenant_cedrnc === selectedTenant.tenant.tenant_cedrnc);
      localStorage.setItem('default_tenant', JSON.stringify(foundTenant))
    } else {
      this.message.add({ sticky: true, severity: 'error', summary: 'Error al actualizar compañia predeterminada', detail: 'El valor ingresado no puede ser nulo.' });
    }

    this.message.add({ severity: 'success', summary: 'Actualización de datos de usuario', detail: 'Se han actualizado los datos de usuario correctamente.' });
    this.saveUserLoading.set(false);
    this.editProfileVisible = false;
  }

  // Cambio de foto de email
  async onChangeEmail() {
    this.changeEmailLoading.set(true);
    if (this.emailFormGroup.valid) {

      await lastValueFrom(this.profileService.updateEmail(this.emailFormGroup.value, this.token()!))

      this.message.add({ sticky: true, severity: 'info', summary: 'Aviso: Actualización de E-mail', detail: 'Se ha enviado un correo a la nueva dirección, verifiquelo para proseguir.' });
      this.emailDialogVisible = false;
      localStorage.setItem('isUpdated', 'true')
    }
    this.changeEmailLoading.set(false);

  }

  async onChangePassword() {
    this.loading.set(true);
    await lastValueFrom(this.profileService.updatePassword(this.user()?.user_email!, this.token()!))
    this.loading.set(false);

    this.message.add({ severity: 'info', summary: 'Aviso: Actualización de Contraseña', detail: 'Se ha enviado un correo a la nueva dirección, verifiquelo para proseguir.' });
  }

  confirmChangePassword() {
    this.confirmationService.confirm({
      message: 'Se le enviará un E-mail a su correo<br><br>¿Está seguro?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.onChangePassword(),
    })
  }
}

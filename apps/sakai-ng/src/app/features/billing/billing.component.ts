import { Component} from '@angular/core';
import { DataGridComponent } from '@org/shared-template';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressBarModule } from 'primeng/progressbar';
import { PaymentRecordComponent } from '@org/shared-template';

@Component({
  selector: 'app-billing',
  imports: [PaymentRecordComponent, ButtonModule, PopoverModule, TagModule, DialogModule, InputTextModule, DatePickerModule, ProgressBarModule],
  templateUrl: './billing.component.html',
  styleUrl: 'billing.component.css'
})
export class BillingComponent {

public isCardDialogVisible: boolean = false;

}

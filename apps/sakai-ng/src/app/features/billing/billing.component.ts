import { Component} from '@angular/core';
import { DataGridComponent } from '../../shared/component/data-grid/data-grid.component';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressBarModule } from 'primeng/progressbar';
import { PaymentRecordComponent } from '../../shared/component/payment-record/payment-record.component';

@Component({
  selector: 'app-billing',
  imports: [PaymentRecordComponent, ButtonModule, PopoverModule, TagModule, DialogModule, InputTextModule, DatePickerModule, ProgressBarModule],
  templateUrl: './billing.component.html',
  styles: ``
})
export class BillingComponent {

public isCardDialogVisible: boolean = false;

}

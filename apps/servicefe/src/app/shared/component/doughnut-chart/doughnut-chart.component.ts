import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { NotFoundMessageComponent } from '../not-found-message/not-found-message.component';

@Component({
  selector: 'app-doughnut-chart',
  imports: [ChartModule, DatePickerModule, ReactiveFormsModule, MessageModule, CommonModule, NotFoundMessageComponent],
  templateUrl: './doughnut-chart.component.html',
  styleUrl: './doughnut-chart.component.css'
})
export class DoughnutChartComponent implements OnInit{
  @Output() _onChangeDate = new EventEmitter();

  @Input()
  public pieData: any;

  @Input()
  public pieOptions: any;

  @Input()
  public dates!: Date[];

  public dateFormat: string = 'dd/mm/yy';

  public dateError: boolean = false

  fromDateControl = new FormControl();

  toDateControl = new FormControl();

  ngOnInit(): void {
    this.fromDateControl.setValue(this.dates[0]);
    this.toDateControl.setValue(this.dates[1]);

    this.fromDateControl.valueChanges.subscribe(() => {
      this.onChangeDate();
    });

    this.toDateControl.valueChanges.subscribe(() => {
      this.onChangeDate();
    });
  }

  onChangeDate(){
    let dates: Date[] = [
      this.fromDateControl.value,
      this.toDateControl.value
    ];

    if(dates[0] > dates[1] || dates[1] < dates[0]){
      this.dateError = true;
      return;
    }

    this.dateError = false;

    this._onChangeDate.emit(dates);
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../service/layout.service';
import { SelectModule } from 'primeng/select';
import { DateOption } from './interfaces/DateOptions';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
    standalone: true,
    selector: 'app-revenue-stream-widget',
    imports: [ChartModule, SelectModule, ReactiveFormsModule],
    templateUrl: 'revenuestreamwidget.component.html',
    styleUrl: 'revenuestreamwidget.component.css'
})
export class RevenueStreamWidget implements OnInit{

    @Output() onChangeTime = new EventEmitter();

    @Input()
    title!: any;

    @Input()
    chartData!: any;

    @Input()
    chartOptions!: any;

    @Input()
    filterDataOptions!: DateOption[];

    @Input()
    selectedTime!: DateOption

    subscription!: Subscription;

    timeFilter = new FormControl();

    constructor(public layoutService: LayoutService) {
        this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => {
        });
    }

    ngOnInit(): void {
      this.timeFilter.setValue(this.selectedTime);
    }

    changeTimeFilter(){
      this.onChangeTime.emit(this.timeFilter.value);
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

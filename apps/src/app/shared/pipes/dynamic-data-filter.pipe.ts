import { CurrencyPipe, DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dynamicDataFilter'
})
export class DynamicDataFilterPipe implements PipeTransform {

  private currencyPipe = new CurrencyPipe('es-DOP')
  private datePipe = new DatePipe('es-DO')

  transform(value: string, type: string): string | null {
    switch(type){
      case 'text':
        return value

      case 'numeric':
        return  this.currencyPipe.transform(value);

      case 'date':
        return this.datePipe.transform(value, 'shortDate');

    }
    return null;
  }

}

import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es-do'

dayjs.extend(relativeTime);
dayjs.locale('es-do')

@Pipe({
  name: 'dateAgo',
  standalone: true
})
export class DateAgoPipe implements PipeTransform {

  transform(value: Date | string): string {
    return dayjs(value).fromNow();
  }

}

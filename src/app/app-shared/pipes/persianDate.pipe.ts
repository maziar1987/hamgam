import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'jalali-moment';

@Pipe({ name: 'persianDate' })
export class persianDatePipe implements PipeTransform {
  transform(date: Date | string, format?: string) {
    if (date) {
      if (format == 'shortDate') {
        //'YYYY/M/D'
        if (date instanceof Date) {
          let year = date.getFullYear();
          let month = date.getMonth();
          let day = date.getDate();

          return moment(new Date(year, month, day)).locale('fa').format('YYYY/M/D');
        } else {
          let year = +date.split('T')[0].split('-')[0];
          let month = +date.split('T')[0].split('-')[1] - 1;
          let day = +date.split('T')[0].split('-')[2];

          return moment(new Date(year, month, day)).locale('fa').format('YYYY/M/D');
        }
      } else if (format == 'shortDateTime') {
        //'YYYY/M/D HH:MM'
        if (date instanceof Date) {
          let year = date.getFullYear();
          let month = date.getMonth();
          let day = date.getDate();

          return moment(new Date(year, month, day, date.getHours(), date.getMinutes(), date.getSeconds())).locale('fa').format('YYYY/M/D HH:mm:ss');
        } else {
          let year = +date.split('T')[0].split('-')[0];
          let month = +date.split('T')[0].split('-')[1] - 1;
          let day = +date.split('T')[0].split('-')[2];

          let hour = +date.split('T')[1].substring(0, 8).split(':')[0];
          let minute = +date.split('T')[1].substring(0, 8).split(':')[1] - 1;
          let second = +date.split('T')[1].substring(0, 8).split(':')[2];

          return moment(new Date(year, month, day, hour, minute, second)).locale('fa').format('YYYY/MM/DD HH:mm');
        }
      }
    }

    // var res = '';
    // if (value) {
    //   var val = value.split(':');
    //   if (val)
    //     res = val[0] + ':' + val[1];
    // }
    // return res;

    var str: string;

    // var time: string[] = date.toString().split('T')[1].split('.')[0].split(':');
    // str = '(' + time[0] + ':' + time[1] + ')';

    // str += ' ';

    str = date?.toString().split('T')[0];

    return str?.replace(/-/gi, "/");
  }
}

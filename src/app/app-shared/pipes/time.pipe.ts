import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'time' })
export class TimePipe implements PipeTransform {
  transform(date: Date) {
    // var res = '';
    // if (value) {
    //   var val = value.split(':');
    //   if (val)
    //     res = val[0] + ':' + val[1];
    // }
    // return res;

    if (!date)
      return '';

    var str: string;

    var time: string[] = date.toString().split('T')[1].split('.')[0].split(':');
    str = time[0] + ':' + time[1];
    return str;
    // str = '(' + time[0] + ':' + time[1] + ')';

    // str += ' ';

    // str += date.toString().split('T')[0];

    // return str.replace(/-/gi, "/");
  }
}

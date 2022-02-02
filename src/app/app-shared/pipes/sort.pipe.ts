import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'sort'})
export class SortPipe implements PipeTransform {
  transform(values: any): any {
    if (values) {
      values = values.sort((a, b) => a.description.substring(0, 1) < b.description.substring(0, 1) ? 1 : -1);
    }
    return values;
  }
}

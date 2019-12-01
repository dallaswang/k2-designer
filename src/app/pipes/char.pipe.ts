import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterChar'
})
export class FilterCharPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
     return value.filter(item => {
        if (args[0]) {
          if(item.name.toLowerCase().includes(args[0].toLowerCase())) {
            return item;
          }
        } else {
          return item;
        }
    });
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchTerm'
})
export class SearchPipe implements PipeTransform {

  // public transform(value, keys: string, term: string) {

  //   if (!term) return value;
  //   return (value || []).filter(item => keys.split(',').some(key => item.hasOwnProperty(key) && new RegExp(term, 'gi').test(item[key])));

  // }
  transform(value: any, args?: any): any {
    if(!value)return null;
    if(!args)return value;

    args = args.toLowerCase();

    return value.filter(function(data){
        return JSON.stringify(data).toLowerCase().includes(args);
    });
}

}

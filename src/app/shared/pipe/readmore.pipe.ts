import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'readmore'
})
export class ReadmorePipe implements PipeTransform {
  showValue
  transform(value: any, maxWords:number,dots:string): any {
    if(!value)return null;
    if(!maxWords)return value;
    this.showValue = value;
    if(value.split('').length > maxWords){
      return value.substring(0, maxWords) + " "+dots;
    }else{
      return value
    }
    
  }
  getAllText() {
    return this.showValue; 
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productfilter'
})
export class ProductfilterPipe implements PipeTransform {

  transform(no:number,o:number,noy:number):any {
  return no*o*noy
  }

}

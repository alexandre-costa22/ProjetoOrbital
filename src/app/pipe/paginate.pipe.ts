import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paginate',
  pure: true
})
export class PaginatePipe implements PipeTransform {
  transform(items: any[], currentPage: number, itemsPerPage: number): any[] {
    if (!items || items.length === 0) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }
}

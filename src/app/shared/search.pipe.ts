import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {

  public transform(items: any[], searchText: string, keys: string[]): any[] {
    if (!items || !searchText || !keys || keys.length === 0) {
      return items;
    }

    const lowerSearchText: string = searchText.toLowerCase();

    return items.filter((item) =>
      keys.some((key: string) => {
        const value = item[key];
        return value && value.toString().toLowerCase().includes(lowerSearchText);
      })
    );
  }
}

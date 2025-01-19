import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-crypto-search',
  templateUrl: './crypto-search.component.html',
  styleUrls: ['./crypto-search.component.css'],
})
export class CryptoSearchComponent {
  @Input() public placeholder: string = 'Search';
  @Output() public searchChanged: EventEmitter<string> = new EventEmitter<string>()

  protected searchText: string = '';

  protected onSearchChange(): void {
    this.searchChanged.emit(this.searchText);
  }
}

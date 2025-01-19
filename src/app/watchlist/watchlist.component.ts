import { Component, OnDestroy, OnInit } from '@angular/core';
import { CryptoService } from '../services/crypto.service';
import { CurrencyService } from '../services/currency.service';
import { Sort } from '@angular/material/sort';
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit, OnDestroy {

  protected displayedColumns: string[] = ['name', 'symbol', 'price', 'marketCap', 'supply'];
  protected filteredCryptoData: any[] = [];
  protected selectedCurrency: string = 'USDT';
  protected searchText: string = '';

  private cryptoData: any[] = [];
  private activeSortColumn: string = 'marketCap';
  private activeSortDirection: 'asc' | 'desc' = 'desc';

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private cryptoService: CryptoService,
    private currencyService: CurrencyService
  ) {}

  public ngOnInit(): void {
    this.currencyService.currentCurrency$
      .pipe(takeUntil(this.destroy$))
      .subscribe((currency: string): void => {
        this.selectedCurrency = currency;
        this.loadCryptoData();
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected onSearchTextChanged(search: string): void {
    this.searchText = search;
  }

  protected loadCryptoData(): void {
    this.cryptoService.getCryptoList(this.selectedCurrency || 'USDT')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any): void => {
        this.cryptoData = data.data.map((coin: any) => ({
          name: coin.name,
          symbol: coin.symbol,
          price: coin.quote[this.selectedCurrency]?.price?.toFixed(10) || 'N/A',
          marketCap: coin.quote[this.selectedCurrency]?.market_cap?.toFixed(3) || 'N/A',
          supply: coin.total_supply?.toLocaleString() || 'N/A',
        }));
      this.applyFiltersAndSort();
    });
  }

  protected onSort(sort: Sort): void {
    this.activeSortColumn = sort.active;
    this.activeSortDirection = sort.direction as 'asc' | 'desc';
    this.applyFiltersAndSort();
  }

  private applyFiltersAndSort(): void {
    let filtered: any[] = this.cryptoData.filter((coin) =>
      coin.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(this.searchText.toLowerCase())
    );

    if (this.activeSortColumn && this.activeSortDirection) {
      filtered = filtered.sort((a: any, b: any): number => {
        const valueA = a[this.activeSortColumn];
        const valueB = b[this.activeSortColumn];

        if (valueA === 'N/A' || valueA === undefined) return 1;
        if (valueB === 'N/A' || valueB === undefined) return -1;

        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return this.activeSortDirection === 'asc'
            ? valueA - valueB
            : valueB - valueA;
        }

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          const comparison: number = valueA.localeCompare(valueB, undefined, {
            numeric: true,
            sensitivity: 'base',
          });
          return this.activeSortDirection === 'asc' ? comparison : -comparison;
        }

        return 0;
      });
    }
    this.filteredCryptoData = filtered;
  }
}

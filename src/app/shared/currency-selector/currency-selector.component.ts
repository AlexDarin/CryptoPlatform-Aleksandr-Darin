import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrencyService } from "../../services/currency.service";
import { Subject, takeUntil } from "rxjs";
import { CryptoService } from "../../services/crypto.service";

@Component({
  selector: 'app-currency-selector',
  templateUrl: './currency-selector.component.html',
  styleUrl: './currency-selector.component.css'
})
export class CurrencySelectorComponent implements OnInit, OnDestroy {

  protected availableCurrencies: string[] = [];
  protected selectedCurrency: string = 'USDT';

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private currencyService: CurrencyService,
    private cryptoService: CryptoService
  ) {}

  public ngOnInit(): void {
    this.cryptoService.getCryptoList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any): void => {
          this.availableCurrencies = data.data.map((crypto: any) => crypto.symbol);
          this.selectedCurrency = this.currencyService.getCurrency();
        }
      );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected onCurrencyChange(newCurrencyEvent: any): void {
    if (newCurrencyEvent && newCurrencyEvent.target) {
      this.currencyService.setCurrency(newCurrencyEvent.target.value);
    }
  }
}

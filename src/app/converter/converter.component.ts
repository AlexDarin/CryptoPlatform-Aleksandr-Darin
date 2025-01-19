import { Component, OnDestroy, OnInit } from '@angular/core';
import { CryptoService } from '../services/crypto.service';
import { catchError, of, Subject, takeUntil } from "rxjs";

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css'],
})
export class ConverterComponent implements OnInit, OnDestroy {

  protected fromSymbol: string = 'BTC';
  protected toSymbol: string = 'ETH';
  protected amount: number = 1;
  protected result: string = '';
  protected errorMessage: string = '';
  protected cryptoList: string[] = [];
  protected filteredCryptoListFrom: string[] = [];
  protected filteredCryptoListTo: string[] = [];
  protected exchangeRate: number | null = null;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private cryptoService: CryptoService
  ) {}

  public ngOnInit(): void {
    this.cryptoService.getCryptoList()
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => {
          this.errorMessage = this.FAILED_TO_LOAD_CRYPTO_LIST_ERROR_MESSAGE;
          return of([]);
        })
      )
      .subscribe(
      (data: any) => {
        this.cryptoList = data.data.map((crypto: any) => crypto.symbol);
        this.filteredCryptoListFrom = [...this.cryptoList];
        this.filteredCryptoListTo = [...this.cryptoList];
      }
    );
    this.updateExchangeRate();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected swapTokens(): void {
    [this.fromSymbol, this.toSymbol] = [this.toSymbol, this.fromSymbol];
    this.updateExchangeRate();
  }

  protected validateAmount(): boolean {
    return this.amount > 0 && Boolean(this.fromSymbol) && Boolean(this.toSymbol);
  }

  protected handleTokenChange(target: 'from' | 'to', newValue: string): void {
    const otherToken: string = target === 'from' ? this.toSymbol : this.fromSymbol;

    if (newValue === otherToken) {
      this.swapTokens();
    } else {
      if (target === 'from') {
        this.fromSymbol = newValue;
        this.filterTokens('from');
      } else {
        this.toSymbol = newValue;
        this.filterTokens('to');
      }
    }
    this.updateExchangeRate();
  }

  protected calculateResult(): void {
    if (this.exchangeRate !== null && this.validateAmount()) {
      this.result = (this.amount * this.exchangeRate).toFixed(4);
    } else {
      this.result = '';
    }
  }

  private updateExchangeRate(): void {
    if (!this.validateAmount()) return;

    this.errorMessage = '';
    this.cryptoService.getCryptoConversion(this.fromSymbol, this.toSymbol, this.amount)
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => {
          this.errorMessage = this.FAILED_TO_CONVERT_ERROR_MESSAGE;
          this.exchangeRate = null;
          this.result = '';
          return of(null);
        })
      )
      .subscribe(
        (data: any) => {
          this.exchangeRate = data.data.quote[this.toSymbol].price;
          this.calculateResult();
        });
  }

  private filterTokens(target: 'from' | 'to'): void {
    const searchTerm: string = target === 'from' ? this.fromSymbol.toLowerCase() : this.toSymbol.toLowerCase();

    const filteredList: string[] = this.cryptoList.filter((token: string) =>
      token.toLowerCase().includes(searchTerm)
    );

    if (target === 'from') {
      this.filteredCryptoListFrom = filteredList;
    } else {
      this.filteredCryptoListTo = filteredList;
    }
  }

  private readonly FAILED_TO_CONVERT_ERROR_MESSAGE: string = "Failed to fetch exchange rate. Try again later.";
  private readonly FAILED_TO_LOAD_CRYPTO_LIST_ERROR_MESSAGE: string = "Failed to load cryptocurrency list. Please try again later.";
}

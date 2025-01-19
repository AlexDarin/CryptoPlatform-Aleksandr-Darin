import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, Subject, switchMap, takeUntil, tap } from "rxjs";
import { CryptoService } from "../services/crypto.service";
import { TransactionType, WalletAsset, WalletTransaction } from "../interfaces/wallet";
import { WalletService } from "../services/wallet.service";
import { CurrencyService } from "../services/currency.service";

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
})
export class WalletComponent implements OnInit, OnDestroy {

  private readonly USDT_TOKEN_KEY: string = "USDT";

  private assetsSubject: BehaviorSubject<WalletAsset[]> = new BehaviorSubject<WalletAsset[]>([]);
  protected assets$: Observable<WalletAsset[]> = this.assetsSubject.asObservable();

  protected transactions: WalletTransaction[] = [];
  protected newAmount: number = 0;
  protected searchText: string = '';
  protected errorMessage: string = '';
  protected totalValue: number = 0;
  protected selectedCurrencyForTotal: string = this.USDT_TOKEN_KEY;
  protected selectedCurrency: string = this.USDT_TOKEN_KEY;
  protected availableCurrencies: string[] = [];

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private cryptoService: CryptoService,
    private currencyService: CurrencyService,
    private walletService: WalletService
  ) {}

  public ngOnInit(): void {
    this.currencyService.currentCurrency$
      .pipe(takeUntil(this.destroy$))
      .subscribe((currency: string): void => {
        this.selectedCurrencyForTotal = currency;
        this.updateAvailableCurrencies();
        this.updateWalletData();
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected selectToken(tokenName: string): void {
    this.selectedCurrency = tokenName;
  }

  protected onSearchTextChanged(search: string): void {
    this.searchText = search;
  }

  protected addFunds(): void {
    this.errorMessage = '';

    if (!this.availableCurrencies.includes(this.selectedCurrency)) {
      this.errorMessage = this.ASSET_NOT_SUPPORTED;
      return;
    }
    if (this.newAmount <= 0) {
      this.errorMessage = this.CANT_ADD_OR_SEND_ZERO_OR_LESS_FUNDS;
      return;
    }

    try {
      if (this.selectedCurrency) {
        const currentAssets: WalletAsset[] = this.assetsSubject.getValue();
        let currentAsset: WalletAsset | undefined = currentAssets.find(
          (asset: WalletAsset): boolean => asset.token === this.selectedCurrency
        );

        this.walletService.createTransaction(TransactionType.DEPOSIT, this.selectedCurrency, this.newAmount)
          .pipe(takeUntil(this.destroy$))
          .subscribe();

        if (currentAsset) {
          const updatedAsset: WalletAsset = {
            ...currentAsset,
            amount: (currentAsset.amount || 0) + this.newAmount
          };

          this.walletService.updateAsset(updatedAsset)
            .pipe(takeUntil(this.destroy$))
            .subscribe((): void => {
              const updatedAssets: WalletAsset[] = currentAssets.map((asset: WalletAsset): WalletAsset =>
                asset.token === this.selectedCurrency ? updatedAsset : asset
              );
              this.assetsSubject.next(updatedAssets);
            });
        } else {
          const newAsset: WalletAsset = {
            id: crypto.randomUUID(),
            token: this.selectedCurrency,
            amount: this.newAmount
          };

          this.walletService.createAsset(newAsset)
            .pipe(takeUntil(this.destroy$))
            .subscribe((): void => {
              this.assetsSubject.next([...currentAssets, newAsset]);
            });
        }

        this.newAmount = 0;
      }
      this.updateWalletData();
    } catch (error) {
      this.errorMessage = this.FAILED_TO_ADD_FUNDS_ERROR_MESSAGE;
    }
  }

  protected sendFunds(): void {
    this.errorMessage = '';

    if (!this.availableCurrencies.includes(this.selectedCurrency)) {
      this.errorMessage = this.ASSET_NOT_SUPPORTED;
      return;
    }

    if (this.newAmount <= 0) {
      this.errorMessage = this.CANT_ADD_OR_SEND_ZERO_OR_LESS_FUNDS;
      return;
    }

    const currentAssets: WalletAsset[] = this.assetsSubject.getValue();
    const currentAsset: WalletAsset | undefined = currentAssets.find(
      (asset: WalletAsset): boolean => asset.token === this.selectedCurrency
    );

    if (!currentAsset || currentAsset.amount < this.newAmount) {
      this.errorMessage = this.NOT_SUFFICIENT_FUNDS_ERROR_MESSAGE;
      return;
    }

    const updatedAsset: WalletAsset = {
      ...currentAsset,
      amount: currentAsset.amount - this.newAmount
    };

    this.walletService.createTransaction(TransactionType.WITHDRAWAL, this.selectedCurrency, this.newAmount)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.walletService.updateAsset(updatedAsset)),
        tap((): void => {
          const updatedAssets: WalletAsset[] = currentAssets
            .map((asset: WalletAsset): WalletAsset => asset.id === updatedAsset.id ? updatedAsset : asset);
          this.assetsSubject.next(updatedAssets);
        })
      )
      .subscribe({
        next: (): void => {
          this.newAmount = 0;
          this.updateWalletData();
        }
      });
  }

  private updateAvailableCurrencies(): void {
    this.cryptoService.getCryptoList()
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => {
          this.errorMessage = this.ERROR_GETTING_CURRENCY_LIST_MESSAGE;
          return of([]);
        })
      )
      .subscribe(
        (data: any): void => {
          this.availableCurrencies = data.data.map((crypto: any) => crypto.symbol);
        }
      );
  }

  private updateWalletData(): void {
    this.updateAssetList();
    this.updateTransactionList();
  }

  private updateAssetList(): void {
    this.walletService.getAssets()
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => {
          this.errorMessage = this.ERROR_LOADING_ASSETS_MESSAGE;
          return of([]);
        })
      )
      .subscribe((data: WalletAsset[]): void => {
        const filteredData: WalletAsset[] = data.filter((asset: WalletAsset): boolean => asset.amount > 0);
        this.assetsSubject.next(filteredData);
        this.calculateTotalValue();
      });
  }

  private calculateTotalValue(): void {
    this.totalValue = 0;

    const currentAssets: WalletAsset[] = this.assetsSubject.getValue()
      .filter((asset: WalletAsset): boolean => asset.amount > 0);

    currentAssets.forEach((asset: WalletAsset): void => {
      this.cryptoService.getCryptoConversion(asset.token, this.selectedCurrencyForTotal, asset.amount)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any): void => {
          const converted = data.data.quote[this.selectedCurrencyForTotal]?.price || 0;
          this.totalValue += +converted;
        });
    });

    if (currentAssets.length !== currentAssets.length) {
      this.assetsSubject.next(currentAssets);
    }
  }

  private updateTransactionList(): void {
    this.walletService.getTransactions()
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => {
          this.errorMessage = this.ERROR_LOADING_TRANSACTION_MESSAGE;
          return of([]);
        })
      )
      .subscribe((data: WalletTransaction[]): void => {
        this.transactions = data;
      });
  }

  private readonly ERROR_LOADING_TRANSACTION_MESSAGE: string = "Failed to load wallet transactions. Please try again later.";
  private readonly ERROR_LOADING_ASSETS_MESSAGE: string = "Failed to load assets. Please try again later";
  private readonly ERROR_GETTING_CURRENCY_LIST_MESSAGE: string = "Failed to fetch list of available currencies. Please try again later.";
  private readonly NOT_SUFFICIENT_FUNDS_ERROR_MESSAGE: string = "Transaction failed. There are not enough funds on the balance.";
  private readonly FAILED_TO_ADD_FUNDS_ERROR_MESSAGE: string = "Failed to add funds. Please try again.";
  private readonly ASSET_NOT_SUPPORTED: string = "This asset is not supported";
  private readonly CANT_ADD_OR_SEND_ZERO_OR_LESS_FUNDS: string = "Can not add or send zero or less funds";
}

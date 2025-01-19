import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {

  private currencySubject: BehaviorSubject<string> = new BehaviorSubject<string>('USDT');
  currentCurrency$: Observable<string> = this.currencySubject.asObservable();

  public getCurrency(): string {
    return this.currencySubject.getValue();
  }

  public setCurrency(currency: string): void {
    this.currencySubject.next(currency);
  }
}

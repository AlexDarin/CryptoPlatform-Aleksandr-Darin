import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../environment";

@Injectable({
  providedIn: 'root',
})
export class CryptoService {

  private coinMarketApiUrl: string = environment.coinMarketApiUrl;
  private coinMarketApiKey: string = environment.coinMarketApiKey;

  constructor(
    private http: HttpClient
  ) {}

  public getCryptoList(convertCurrency: string = 'USDT'): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      'X-CMC_PRO_API_KEY': this.coinMarketApiKey,
    });

    return this.http.get(`${this.coinMarketApiUrl}/cryptocurrency/listings/latest?sort=market_cap&convert=${convertCurrency}`, {
      headers
    });
  }

  public getCryptoConversion(from: string, to: string, amount: number): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      'X-CMC_PRO_API_KEY': this.coinMarketApiKey,
    });

    return this.http.get(
      `${this.coinMarketApiUrl}/tools/price-conversion?symbol=${from}&convert=${to}&amount=${amount}`,
      { headers }
    );
  }
}

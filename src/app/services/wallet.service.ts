import { Injectable } from "@angular/core";
import { environment } from "../environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { TransactionType, WalletAsset, WalletTransaction } from "../interfaces/wallet";

@Injectable({
  providedIn: "root"
})
export class WalletService {

  private readonly apiUrl: string = environment.apiUrl;
  private readonly transactionApiUrl: string = this.apiUrl + "/transactions";
  private readonly assetApiUrl: string = this.apiUrl + "/assets";

  constructor(
    private httpClient: HttpClient
  ) {}

  public getTransactions(): Observable<WalletTransaction[]> {
    return this.httpClient.get<WalletTransaction[]>(this.transactionApiUrl);
  }

  public createTransaction(type: TransactionType, token: string, amount: number): Observable<void> {
    const newTransaction: WalletTransaction = {
      id: crypto.randomUUID(),
      token: token,
      amount: amount,
      type: type,
      date: new Date().toISOString().split('T')[0]
    }

    return this.httpClient.post<void>(this.transactionApiUrl, newTransaction);
  }

  public getAssets(): Observable<WalletAsset[]> {
    return this.httpClient.get<WalletAsset[]>(this.assetApiUrl);
  }

  public createAsset(asset: WalletAsset): Observable<void> {
    return this.httpClient.post<void>(this.assetApiUrl, asset);
  }

  public updateAsset(asset: WalletAsset): Observable<void> {
    return this.httpClient.put<void>(`${this.assetApiUrl}/${asset.id}`, asset);
  }
}

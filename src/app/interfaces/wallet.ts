export interface WalletTransaction {
  id: string;
  token: string;
  amount: number;
  type: TransactionType
  date: string
}

export enum TransactionType {
  DEPOSIT = "Deposit",
  WITHDRAWAL = "Withdrawal",
}

export interface WalletAsset {
  id: string
  token: string;
  amount: number;
}



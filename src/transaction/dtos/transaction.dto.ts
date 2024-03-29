// transaction.interface.ts
export interface TransactionDto {
  id: string;
  type: 'buy' | 'sell';
  fundSymbol: string;
  date: Date;
  price: number;
  // Add other details as needed
}

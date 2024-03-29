import { Transaction } from 'src/transaction/entities/transaction.entity';

// block.interface.ts
export interface BlockDto {
  blockId: number;
  // TODO: FIXME Never expose entity directly in a DTO.
  transactions: Transaction[];
}

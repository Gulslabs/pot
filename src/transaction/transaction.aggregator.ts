import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { TransactionDto } from './dtos/transaction.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as SHA256 from 'crypto-js/sha256';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
@Processor('transactions')
export class TransactionAggregator {
  // TODO: Should be a config parameter
  private isTimeBased: boolean;
  private transactionDtos: TransactionDto[] = [];
  private timer: NodeJS.Timeout;
  // Assume block ID starts from 1 and increments sequentially. TODO: Temporary: To be captured from Block.sol events.
  private blockId: number = 1;

  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {
    this.subscribeToTransactionEvents();
  }

  /**
   *
   */
  subscribeToTransactionEvents() {
    this.eventEmitter.on('transaction', ({ transactionDto }) => {
      this.consumeTransaction(transactionDto);
    });
  }

  consumeTransaction(transactionDto: any) {
    this.transactionDtos.push(transactionDto);
    if (this.isTimeBased) {
      if (!this.timer) {
        this.timer = setTimeout(() => this.createBlock(), 3000); // 5 minutes
      }
    } else {
      if (this.transactionDtos.length >= 10) {
        this.createBlock();
      }
    }
  }

  /**
   * Generate a block
   * @returns
   */
  private async createBlock() {
    if (this.transactionDtos.length === 0) {
      return;
    }
    // console.log(`Transaction Dto's ${JSON.stringify(this.transactionDtos)}`);
    const transactions = await Promise.all(
      this.transactionDtos.map(async (transactionDto) => {
        const transaction =
          await this.hashTransactionAndSave(transactionDto);
        // console.log(`Transaction Entity ${JSON.stringify(transactionEntity)}`);
        return transaction;
      }),
    );
    // console.log(`Transactions Entities for Block  ${JSON.stringify(transactions)}`);
    const block = {
      blockId: this.blockId++,
      transactions: transactions,
    };
    console.log(`Block being Emitted: ${JSON.stringify(block)}`);
    this.eventEmitter.emit('block', { block });
    this.transactionDtos = [];
    clearTimeout(this.timer);
    this.timer = null;
  }

  /**
   * Create hash of the transaction and save transaction.
   * @param transactionDto
   */
  private async hashTransactionAndSave(
    transactionDto: TransactionDto,
  ): Promise<Transaction> {
    const data = `${transactionDto.id}-${transactionDto.type}-${transactionDto.fundSymbol}-${transactionDto.date}-${transactionDto.price}`;
    const leaf = SHA256(data);
    // Store transaction entity in the database
    const transactionEntity = await this.transactionRepo.save({
      transactionId: transactionDto.id,
      leaf: leaf,
    });
    return transactionEntity;
  }
}

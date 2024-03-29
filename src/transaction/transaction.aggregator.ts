import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { TransactionDto } from './dtos/transaction.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as CryptoJS from 'crypto-js';
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
    private transactionRepo: Repository<Transaction>
  ) {}

  /**
   * Aggregate Transaction and process a block
   * @param job
   */
  @Process()
  async aggregateAndProcessTransactions(job: Job<TransactionDto>) {
    const transactionDto: TransactionDto = job.data;
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
  private createBlock() {
    if (this.transactionDtos.length === 0) {
      return;
    }
    const transactions = this.transactionDtos.map((transactionDto) =>
      this.hashTransactionAndSave(transactionDto),
    );
    const block = {
      blockId: this.blockId++, 
      transactions: transactions,
    };
    console.log(`Block Emitted: ${JSON.stringify(block)}`);
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
    const hash = CryptoJS.SHA256(data).toString();
    // Store transaction entity in the database
    const transactionEntity = this.transactionRepo.create({
      transactionId: transactionDto.id,
      hash: hash,
    });
    return  await this.transactionRepo.save(transactionEntity);    
  }
}

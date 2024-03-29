import { Injectable } from '@nestjs/common';

import { AbstractService } from 'src/shared/abstract.service';
import { Repository } from 'typeorm';
import { TransactionDto } from './dtos/transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class TransactionService extends AbstractService {
  constructor(
    @InjectQueue('transactions') private readonly transactionsQueue: Queue,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {
    super(transactionRepo);
  }

  async emitTransaction(transactionDto: TransactionDto) {
    await this.transactionsQueue.add(transactionDto.id, transactionDto);
  }
}

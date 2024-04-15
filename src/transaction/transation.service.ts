import { Injectable } from '@nestjs/common';

import { InjectQueue } from '@nestjs/bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { AbstractService } from 'src/shared/abstract.service';
import { Repository } from 'typeorm';
import { TransactionDto } from './dtos/transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService extends AbstractService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectQueue('transactions') private readonly transactionsQueue: Queue,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {
    super(transactionRepo);    
  }

  async emitTransaction(transactionDto: TransactionDto) {
    this.eventEmitter.emit('transaction', { transactionDto });
    //await this.transactionsQueue.add(transactionDto.id, transactionDto);
  }
}

import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/shared/abstract.service';
import { Repository } from 'typeorm';
import { TransactionDto } from './dtos/transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService extends AbstractService {
  
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {
    super(transactionRepo);    
  }

  async emitTransaction(transactionDto: TransactionDto) {
    this.eventEmitter.emit('transaction', { transactionDto });
    //await this.transactionsQueue.add(transactionDto.id, transactionDto);
  }
  
  verifyTransaction(transactionId: string) {
    throw new Error('Method not implemented.');
  }
}

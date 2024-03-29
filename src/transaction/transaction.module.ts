import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'transactions' }),
    TypeOrmModule.forFeature([Transaction]),
  ],
  // providers: [TransactionService, TransactionAggregator],
  // exports: [TransactionService, TransactionAggregator],
  // controllers: [TransactionController],
})
export class TransactionModule {}

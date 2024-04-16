import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionAggregator } from './transaction.aggregator';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transation.service';

@Module({
  imports: [  
    TypeOrmModule.forFeature([Transaction])
  ],
   providers: [TransactionService, TransactionAggregator],
   exports: [TransactionService],
   controllers: [TransactionController],
})
export class TransactionModule {}

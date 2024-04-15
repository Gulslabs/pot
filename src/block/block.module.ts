import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockProcessor } from './block.processor';
import { BlockService } from './block.service';
import { Block } from './entities/block.entity';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [TypeOrmModule.forFeature([Block]), TransactionModule],
  providers: [BlockService, BlockProcessor],
})
export class BlockModule {}

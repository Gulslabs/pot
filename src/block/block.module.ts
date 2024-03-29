import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockProcessor } from './block.processor';
import { BlockService } from './block.service';
import { Block } from './entities/block.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Block])],
  providers: [BlockService, BlockProcessor],
})
export class BlockModule {}

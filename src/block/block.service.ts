import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/shared/abstract.service';
import { Repository } from 'typeorm';
import { BlockProcessor } from './block.processor';
import { BlockDto } from './dtos/block.dto';
import { Block } from './entities/block.entity';

@Injectable()
export class BlockService extends AbstractService{
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(Block)
    private readonly blockRepository: Repository<Block>,    
    private readonly blockProcessor: BlockProcessor
  ) {
    super(blockRepository);
    this.subscribeToBlockEvents();
  }

  /**
   * 
   */
  subscribeToBlockEvents() {
    this.eventEmitter.on('block', ({ block }) => {
         this.consumeBlock(block);
    });
  }

  async consumeBlock(block: BlockDto) {
    const merkleTree = this.blockProcessor.createMekleTree(block);
    await this.saveBlock(merkleTree.getRoot().toString('hex'), block.blockId.toString());
    await this.blockProcessor.updateBlockTransaction(block, merkleTree);
  }

  /**
   *
   * @param merkleRoot
   * @param blockId
   */
  private async saveBlock(merkleRoot: string, blockId: string) {
    // Persist block entity
    const blockEntity = this.blockRepository.create({
      blockId: blockId,
      merkleRoot: merkleRoot,
    });
    await this.blockRepository.save(blockEntity);
  }


}

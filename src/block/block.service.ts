import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/shared/abstract.service';
import { Repository } from 'typeorm';
import { BlockProcessor } from './block.processor';
import { BlockDto } from './dtos/block.dto';
import { Block } from './entities/block.entity';
import MerkleTree from 'merkletreejs';

@Injectable()
export class BlockService extends AbstractService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(Block)
    private readonly blockRepository: Repository<Block>,
    private readonly blockProcessor: BlockProcessor,
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

  async consumeBlock(blockDto: BlockDto) {
    const merkleTree = this.blockProcessor.createMekleTree(blockDto);
    const block = await this.saveBlock(
      merkleTree,
      blockDto.blockId.toString(),
    );
    await this.blockProcessor.updateBlockTransaction(blockDto, block, merkleTree);
  }

  /**
   *
   * @param merkleRoot
   * @param blockId
   */
  private async saveBlock(merkleTree: MerkleTree, blockId: string): Promise<Block> {
    // Persist block entity
    const blockEntity = this.blockRepository.create({
      blockId: blockId,
      merkleTree: merkleTree.toString()
    });
    return await this.blockRepository.save(blockEntity);
  }
}

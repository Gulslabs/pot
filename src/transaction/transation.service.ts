import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import MerkleTree from 'merkletreejs';
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

  async verifyTransaction(transactionId: string): Promise<boolean> {
    // 1. Retrieve one Transaction ; its proof, leaf
    // 2. Retrieve Block, get merkleTree and proof.
    const transaction = await this.transactionRepo.findOne({
      where: {
        transactionId: transactionId,
      },
      relations: {
        block: true,
      },
    });
    if (!transaction) {
      throw new BadRequestException('Invalid Request', {
        cause: new Error(),
        description: `Unable to retrieve Transaction. TransactionId: ${transactionId}`,
      });
    }
    //console.log(`Transaction Retrieved: ${JSON.stringify(transaction)}`);
    const root = Buffer.from(transaction.block.root, 'hex');
    const leaf = Buffer.from(transaction.leaf, 'hex');
    const proofs = transaction.proofs.map((p) => Buffer.from(p, 'hex'));
    const tree = new MerkleTree([root]);
    console.log(
      `Root: ${root}, Leaf: ${leaf}, Proofs: ${proofs}, tree: ${tree.toString()}`,
    );
    return tree.verify(proofs, leaf, root);
  }
}

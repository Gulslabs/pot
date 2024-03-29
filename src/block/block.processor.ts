import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import merkle from 'merkle';
import { Block } from './entities/block.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockDto } from './dtos/block.dto';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { TransactionService } from 'src/transaction/transation.service';

@Injectable()
export class BlockProcessor {
 // constructor(private readonly transactionService: TransactionService) {}

  /**
   * Calculate MerkleTree from transaction hashes
   * @param block
   * @returns
   */
  createMekleTree(block: BlockDto): any {
    console.log(`Consuming Block: ${JSON.stringify(block)}`);
    // Extract transaction hashes
    const transactionHashes = block.transactions.map(
      (transaction) => transaction.hash,
    );
    // Calculate the Merkle root
    const merkleTree = merkle('sha256').sync(transactionHashes);
    return merkleTree;
  }

  async updateBlockTransaction(block: BlockDto, merkleTree: any) {
    for (const transaction of block.transactions) {
      const proofs = merkleTree.getProof(transaction.hash);

      // this.transactionService.update(
      //   { transactionId: transaction.id },
      //   { proofs: proofs, blockId: block.blockId },
      // );
    }
  }

  /**
   * TODO: Use FireFly SDK, with a Firefly Service layer to call API; that will execute certain method on Block.sol
   * @param merkleRoot
   * @param blockId
   */
  private async storeBlockInContract(merkleRoot: string, blockId: number) {
    // Implement logic to interact with your smart contract to store merkleRoot and blockId
  }
}

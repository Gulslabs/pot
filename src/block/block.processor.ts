import { Injectable } from '@nestjs/common';
import * as SHA256 from 'crypto-js/sha256';
import { MerkleTree } from 'merkletreejs';
import { BlockDto } from './dtos/block.dto';
import { TransactionService } from 'src/transaction/transation.service';
@Injectable()
export class BlockProcessor {
  constructor(private readonly transactionService: TransactionService) {}

  /**
   * Calculate MerkleTree from transaction hashes
   * @param block
   * @returns
   */
  createMekleTree(block: BlockDto): any {
    console.log(`Block Received: ${JSON.stringify(block)}`);
    // Extract transaction hashes
    const transactionHashes = block.transactions.map(
      (transaction) => transaction.hash,
    );    
    console.log(`Transaction Hashes ${transactionHashes}`);
    const merkleTree = new MerkleTree(transactionHashes, SHA256)        
    return merkleTree;
  }

  async updateBlockTransaction(block: BlockDto, merkleTree: any) {
    for (const transaction of block.transactions) {
      const proofs = merkleTree.getProof(transaction.hash);

       await this.transactionService.update(
         { id: transaction.id },
         { proofs: proofs, blockId: block.blockId },
       );
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

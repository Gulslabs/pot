import { Block } from 'src/block/entities/block.entity';
import { BaseEntity } from 'src/shared/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Transaction extends BaseEntity {
  @Column()
  transactionId: string;

  @Column()
  leaf: string;

  @Column('simple-array', {nullable: true}) // Store Merkle proof as an array of strings (hexadecimal)
  proofs: string[];
  
  @ManyToOne(() => Block, (block) => block.id, { nullable: true })
  block: Block;
}

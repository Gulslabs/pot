import { BaseEntity } from 'src/shared/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Transaction extends BaseEntity {
  @Column()
  transactionId: string;

  @Column()
  hash: string;

  @Column('simple-json', { nullable: true })
  proofs: string;

  @Column({ nullable: true })
  blockId: number;
}

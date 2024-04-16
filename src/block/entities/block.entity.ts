import { BaseEntity } from 'src/shared/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Block extends BaseEntity{ 
  @Column()
  blockId: string;

  @Column()
  root: string;
}
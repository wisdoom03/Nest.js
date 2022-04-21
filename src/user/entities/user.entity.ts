import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID, { description: 'Example field (placeholder)' })
  // primary는 기본 키값
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // varchar ? 검색해보기
  @Column({ type: 'varchar', length: '80' })
  password: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: '50' })
  email: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: '50' })
  name: string;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;
}

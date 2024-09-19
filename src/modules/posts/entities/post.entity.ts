import User from 'src/modules/users/entities/user.entity';
import {
  Entity,
  CreateDateColumn,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty, IsNumber } from 'class-validator';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @ManyToOne(() => User, (users) => users.post)
  @JoinColumn({ name: 'idUser' })
  user: User;

  @Column()
  text: string;

  @Column({ nullable: true, default: 0 })
  likeQty: number;

  // teg
  //comment

  @CreateDateColumn()
  timeCteated: Date;
}

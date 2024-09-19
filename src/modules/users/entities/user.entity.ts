import { IsNotEmpty, IsNumber } from 'class-validator';
import { Post } from 'src/modules/posts/entities/post.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export default class User {
  @PrimaryGeneratedColumn({ name: 'idUser' })
  id: number;

  @Column()
  userName: string;

  @Column()
  gender: string; //   gender: 'man' | 'woman' | 'not answered';

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @IsNotEmpty()
  @IsNumber()
  @OneToMany(() => Post, (posts) => posts.user, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idUser' })
  post: Post[];

  // @Column({ nullable: true })post
  // friendList: String[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //user post
  // user role
}

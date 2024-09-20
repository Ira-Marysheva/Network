import User from 'src/modules/users/entities/user.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Comment {
  //iduser

  @PrimaryGeneratedColumn({ name: 'idComment' })
  id: number;

  @Column()
  text: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true, default: 0 })
  likeQty: number;

  @ManyToOne(() => User, (user) => user.comment)
  @JoinColumn({ name: 'idUser' })
  user: User;

  @ManyToOne(() => Post, (post) => post.comment)
  @JoinColumn({ name: 'idPost' })
  post: Post;
}

import User from 'src/modules/users/entities/user.entity';
import { Posts } from 'src/modules/posts/entities/post.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
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

  @ManyToOne(() => Posts, (post) => post.comment)
  @JoinColumn({ name: 'idPost' })
  post: Posts;

  @ManyToMany(() => User, (user) => user.commentLiked)
  @JoinTable({
    name: 'User_liked_comment',
    joinColumn: { name: 'commentId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  userLiked: User[];
}

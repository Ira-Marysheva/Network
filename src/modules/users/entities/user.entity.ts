import { IsNotEmpty, IsNumber } from 'class-validator';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToMany,
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

  @Column({ select: false })
  password: string;

  // @Column({ nullable: true })post
  // friendList: String[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // user role

  @OneToMany(() => Comment, (comments) => comments.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'idComment' })
  comment: Comment[];

  @IsNotEmpty()
  @IsNumber()
  @OneToMany(() => Post, (posts) => posts.user, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idPost' })
  post: Post[];

  @ManyToMany(() => Post, (posts) => posts.userLiked)
  postLiked: Post[];

  @ManyToMany(() => Comment, (comment) => comment.userLiked)
  commentLiked: Comment[];
}

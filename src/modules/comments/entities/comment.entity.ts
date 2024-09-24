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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Comment {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'idComment' })
  id: number;

  @ApiProperty()
  @Column()
  text: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ nullable: true, default: 0 })
  @Column({ nullable: true, default: 0 })
  likeQty: number;

  @ManyToOne(() => User, (user) => user.comment)
  @JoinColumn({ name: 'idUser' })
  user: User;

  @ManyToOne(() => Posts, (post) => post.comment)
  @JoinColumn({ name: 'idPost' })
  post: Posts;

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.commentLiked)
  @JoinTable({
    name: 'User_liked_comment',
    joinColumn: { name: 'commentId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  userLiked: User[];
}

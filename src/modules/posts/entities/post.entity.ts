import User from 'src/modules/users/entities/user.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import {
  Entity,
  CreateDateColumn,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { IsNotEmpty, IsNumber } from 'class-validator';

@Entity()
export class Post {
  @PrimaryGeneratedColumn({ name: 'idPost' })
  id: number;

  @Column()
  text: string;

  @Column({ nullable: true, default: 0 })
  likeQty: number;
  // teg
  //comment

  @CreateDateColumn()
  timeCteated: Date;

  @OneToMany(() => Comment, (comments) => comments.post, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'idComment' })
  comment: Comment[];

  @IsNotEmpty()
  @ManyToOne(() => User, (users) => users.post)
  @JoinColumn({ name: 'idUser' })
  user: User;

  @ManyToMany(() => User, (posts) => posts.postLiked, { cascade: true })
  @JoinTable({
    name: 'User_liked_post',
    joinColumn: { name: 'postId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  userLiked: User[];
}

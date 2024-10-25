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
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Posts {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'idPost' })
  id: number;

  @ApiProperty()
  @Column()
  text: string;

  @ApiProperty({ nullable: true, default: 0 })
  @Column({ nullable: true, default: 0 })
  likeQty: number;
  // teg

  @ApiProperty()
  @CreateDateColumn()
  timeCteated: Date;

  @ApiProperty()
  @OneToMany(() => Comment, (comments) => comments.post, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'idComment' })
  comment: Comment[];

  // @ApiProperty()
  @IsNotEmpty()
  @ManyToOne(() => User, (users) => users.post)
  @JoinColumn({ name: 'idUser' })
  user: User;

  @ApiProperty()
  @ManyToMany(() => User, (posts) => posts.postLiked, { cascade: true })
  @JoinTable({
    name: 'User_liked_post',
    joinColumn: { name: 'postId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  userLiked: User[];
}

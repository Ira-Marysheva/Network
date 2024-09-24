import { IsNotEmpty, IsNumber } from 'class-validator';
import { Posts } from 'src/modules/posts/entities/post.entity';
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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export default class User {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'idUser' })
  id: number;

  @ApiProperty()
  @Column()
  userName: string;

  @ApiProperty()
  @Column()
  gender: string; //   gender: 'man' | 'woman' | 'not answered';

  @ApiProperty({ uniqueItems: true })
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column()
  password: string;

  // @Column({ nullable: true })post
  // friendList: String[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  // user role
  @ApiProperty()
  @OneToMany(() => Comment, (comments) => comments.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'idComment' })
  comment: Comment[];

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @OneToMany(() => Posts, (posts) => posts.user, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idPost' })
  post: Posts[];

  // @ApiProperty()
  @ManyToMany(() => Posts, (posts) => posts.userLiked)
  postLiked: Posts[];

  @ApiProperty()
  @ManyToMany(() => Comment, (comment) => comment.userLiked)
  commentLiked: Comment[];
}

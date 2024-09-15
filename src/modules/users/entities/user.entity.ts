import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  idUser: number;

  @Column()
  userName: string;

  @Column()
  gender: string;
  //   gender: 'man' | 'woman' | 'not answered';
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  // @Column({ nullable: true })
  // friendList: String[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //user post
  // user role
}

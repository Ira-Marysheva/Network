import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthAnswerDTO } from './response/index';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private emailService: EmailService
  ) {}

  // create new user
  async create(createUserDto: CreateUserDto, fileUrl:string): Promise<AuthAnswerDTO> {
    //find in exist user user with input param
    const existUser = await this.usersRepository.findOne({
      // select: {
      //   id: true,
      //   userName: true,
      //   email: true,
      //   gender: true,
      //   createdAt: true,
      //   updatedAt: true,
      //   roles: true,
      //   userPhotoUrl:true
      // },
      where: { email: createUserDto.email },
      relations: { comment: true, post: true },
    });
    if (existUser) {
      throw new BadRequestException('User with this email already used!');
    }
    // create new user in DB
    await this.usersRepository.save({
      userName: createUserDto.userName,
      email: createUserDto.email,
      password: await bcrypt.hash(createUserDto.password, 10),
      gender: createUserDto.gender,
      roles:createUserDto.roles,
      userPhotoUrl:fileUrl
      // friendList: createUserDto.friendList,
    });

    //create values for authorization
    const user = await this.usersRepository.findOne({
      select: {
        id: true,
        userName: true,
        email: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
        userPhotoUrl:true,
        roles: true,
      },
      where: { email: createUserDto.email },
    });

    const token = this.jwtService.sign({
      email: user.email,
      username: user.userName, 
      id: user.id, 
      roles:user.roles 
    });

    this.emailService.sendUserConfirnation( user.email, user.userName , token)

    return {
      user,
      token,
    };
  }
  async findOneForAuth(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOne({
        where: { email },
        relations: { post: true, comment: true },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  //find one user for email
  async findOne(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOne({
        select: {
          id: true,
          userName: true,
          email: true,
          gender: true,
          createdAt: true,
          updatedAt: true,
          roles:true
        },
        where: { email },
        relations: { post: true, comment: true },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  //find one user for id
  async findOneById(id: number): Promise<User> {
    try {
      return await this.usersRepository.findOne({
        select: {
          id: true,
          userName: true,
          email: true,
          gender: true,
          createdAt: true,
          updatedAt: true,
          roles:true
        },
        where: { id },
        relations: { post: true, comment: true },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  // update exist user
  async update(id: number, updateUserDto: UpdateUserDto): Promise<boolean> {
    const user = await this.usersRepository.find({
      select: {
        id: true,
        userName: true,
        email: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
        roles:true
      },
      where: { id },
      relations: { comment: true, post: true },
    });
    if (!user.length)
      throw new BadRequestException('User doesn`t exist it system');
    await this.usersRepository.update(id, updateUserDto);
    return true;
  }

  // update photo user
  async updatePostUrl(id:number, fileUrl:string):Promise<boolean>{
    const user = await this.usersRepository.find({
      select: {
        id: true,
        userName: true,
        email: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
        userPhotoUrl:true,
        roles:true
      },
      where: { id },
      relations: { comment: true, post: true },
    });
    if (!user.length)
      throw new BadRequestException('User doesn`t exist it system');
    await this.usersRepository.update(id, {userPhotoUrl:fileUrl});
    return true;
  }

  //delete exist user
  async remove(id: number): Promise<boolean> {
    const user = await this.usersRepository.find({
      select: {
        id: true,
        userName: true,
        email: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
        roles:true
      },
      where: { id },
      relations: { comment: true, post: true },
    });
    if (!user.length)
      throw new BadRequestException('User doesn`t exist it system');
    await this.usersRepository.delete(id);
    return true;
  }
}

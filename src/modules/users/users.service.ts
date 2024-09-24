import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthAnswerDTO } from './response/index';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // create new user
  async create(createUserDto: CreateUserDto): Promise<AuthAnswerDTO> {
    //find in exist user user with input param
    const existUser = await this.usersRepository.find({
      select: {
        id: true,
        userName: true,
        email: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { email: createUserDto.email },
      relations: { comment: true, post: true },
    });

    if (existUser.length) {
      throw new BadRequestException('User with this email already used!');
    }
    // create new user in DB
    await this.usersRepository.save({
      userName: createUserDto.userName,
      email: createUserDto.email,
      password: await bcrypt.hash(createUserDto.password, 10),
      gender: createUserDto.gender,
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
      },
      where: { email: createUserDto.email },
    });
    const token = this.jwtService.sign({
      email: createUserDto.email,
    });

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
      },
      where: { id },
      relations: { comment: true, post: true },
    });
    if (!user.length)
      throw new BadRequestException('User doesn`t exist it system');
    await this.usersRepository.update(id, updateUserDto);
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

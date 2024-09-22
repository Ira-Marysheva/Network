import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.usersRepository.find({
      where: { email: createUserDto.email },
      relations: { comment: true, post: true },
    });
    if (existUser.length)
      throw new BadRequestException('User with this email already used!');

    const user = await this.usersRepository.save({
      userName: createUserDto.userName,
      email: createUserDto.email,
      password: await bcrypt.hash(createUserDto.password, 10),
      gender: createUserDto.gender,
      // friendList: createUserDto.friendList,
    });

    const token = this.jwtService.sign({
      email: createUserDto.email,
    });

    return {
      user,
      token,
    };
  }

  async findAll(id: number) {
    return await this.usersRepository.find({
      where: { id },
      // relations: { post: true, comment: true },
    });
  }

  async findOne(email: string) {
    return await this.usersRepository.findOne({
      where: { email },
      relations: { post: true, comment: true },
    });
  }
  async findOneById(id: number) {
    return await this.usersRepository.findOne({
      where: { id },
      relations: { post: true, comment: true },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.find({
      where: { id },
      relations: { comment: true, post: true },
    });
    if (!user.length)
      throw new BadRequestException('User doesn`t exist it system');
    return await this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    const user = await this.usersRepository.find({
      where: { id },
      relations: { comment: true, post: true },
    });
    if (!user.length)
      throw new BadRequestException('User doesn`t exist it system');
    return await this.usersRepository.delete(id);
  }
}

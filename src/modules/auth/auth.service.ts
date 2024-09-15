import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/LoginUserDto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private UserService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.UserService.findOne(email);
    const comparePassword = await bcrypt.compare(password, user.password);
    if (user && comparePassword) return user;
    throw new UnauthorizedException(
      'User or password is incorrect. Please try again)',
    );
  }
  async login(user: LoginUserDto) {
    const { email, userName } = user;
    return {
      email,
      userName,
      token: await this.jwtService.sign({ email, userName }),
    };
  }

  //   findAll() {
  //     return `This action returns all auth`;
  //   }

  //   findOne(id: number) {
  //     return `This action returns a #${id} auth`;
  //   }

  //   update(id: number, updateAuthDto: UpdateAuthDto) {
  //     return `This action updates a #${id} auth`;
  //   }

  //   remove(id: number) {
  //     return `This action removes a #${id} auth`;
  //   }
}

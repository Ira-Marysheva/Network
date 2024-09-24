import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
    const user = await this.UserService.findOneForAuth(email);
    if (!user)
      throw new BadRequestException(
        'User with this email and password doesn`t exist',
      );
    const comparePassword = await bcrypt.compare(password, user.password);
    if (user && comparePassword) return user;
    throw new UnauthorizedException(
      'User or password is incorrect. Please try again)',
    );
  }
  async login(user: LoginUserDto) {
    const { email, id } = user;
    return {
      email,
      id,
      token: await this.jwtService.sign({ email, id }),
    };
  }
}

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from './dto/LoginUserDto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Roles } from './roles.decorator';

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
    const { email, id, roles } = user;
    return {
      email,
      id,
      roles,
      token: await this.jwtService.sign({ email, id, roles }),
    };
  }
  async logout({id, email, roles}, token: string):Promise<void>{
    try {
      if(id && email && token  && roles){
        id = null
        email = null
        token = null,
        roles = null
      }
    } catch (error) {
      console.log(error)
    }
  }
}

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  Res
} from '@nestjs/common';
import { LoginUserDto } from './dto/LoginUserDto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import {Response} from 'express'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private UsersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.UsersService.findOneForAuth(email);
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
  async login(@Res({passthrough: true}) res:Response, loginUser:LoginUserDto) {
    const user = await this.validateUser(loginUser.email, loginUser.password);
    const payload = { username: user.userName, id: user.id, roles:user.roles, email:user.email };
    const token = this.jwtService.sign(payload);

    // Set the token in a cookie
    res.cookie('token_cookies', token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: true, // Set to true if using HTTPS
      maxAge: 3600000, // 1 hour
    });
    return {
      email:payload.email,
      id:payload.id,
      roles:payload.roles,
      token: token
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

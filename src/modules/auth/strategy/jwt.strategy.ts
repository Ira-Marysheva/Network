import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from '../dto/LoginUserDto';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configServer: ConfigService, private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req)=>{
          return req.cookies['token_cookies'] //  витягнути токен з cookies
        }
      ]),
      ignoreExpiration: false,
      secretOrKey: configServer.get('JWT_SECRET'),
    });
  }

  async validate(user: LoginUserDto) {
    const findUser = await this.usersService.findOneForAuth(user.email)
    return findUser
  }
}

import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LoginUserDto } from './dto/LoginUserDto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { request } from 'http';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiTags('API-Authorization')
  @ApiResponse({
    status: 200,
    type: LoginUserDto,
    description: 'Login',
  })
  @ApiQuery({ name: 'req.user', type: LoginUserDto })
  @Post('login')
  login(@Req() req) {
    return this.authService.login(req.user);
  }
  @UseGuards(JwtAuthGuard)
  @ApiTags('API-Authorization')
  @ApiResponse({
    status: 204,
    type: LoginUserDto,
    description: 'Log out',
  })
  @Post('logout')
  logout(@Req() req):Promise<void> {
    return this.authService.logout(req.user,req.headers.authorization);
  }

}

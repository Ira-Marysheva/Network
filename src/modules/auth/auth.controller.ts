import { Controller, Post, Get, UseGuards, Req, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LoginUserDto } from './dto/LoginUserDto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
  login(@Res({passthrough:true}) res, @Body() loginUserDto: LoginUserDto) {
    return this.authService.login(res, loginUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiTags('API-Authorization')
  @ApiResponse({
    status: 204,
    type: LoginUserDto,
    description: 'Log out',
  })
  @Get('logout')
  logout(@Req() req, @Res({passthrough:true}) res):Promise<void> {
    res.clearCookie('token_cookies');
    return this.authService.logout(req.user,req.headers.authorization);
  }

}

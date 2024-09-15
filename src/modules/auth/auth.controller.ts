import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req) {
    return this.authService.login(req.user);
  }
}
// @Post()
// create(@Body() createAuthDto: LoginUserDto) {
//   return this.authService.create(createAuthDto);
// }

// @Get()
// findAll() {
//   return this.authService.findAll();
// }

// @Get(':id')
// findOne(@Param('id') id: string) {
//   return this.authService.findOne(+id);
// }

// @Patch(':id')
// update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
//   return this.authService.update(+id, updateAuthDto);
// }

// @Delete(':id')
// remove(@Param('id') id: string) {
//   return this.authService.remove(+id);
// }
// }

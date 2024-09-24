import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthAnswerDTO } from './response';
import User from './entities/user.entity';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // create new user
  @ApiTags('API-Users')
  @ApiResponse({
    status: 201,
    type: CreateUserDto,
    description: 'Create new user',
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<AuthAnswerDTO> {
    return this.usersService.create(createUserDto);
  }

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // findAll(@Req() req) {
  //   return this.usersService.findAll(+req.user.id);
  // }

  // get one user by id
  @ApiTags('API-Users')
  @ApiResponse({
    status: 200,
    type: User,
    description: 'Find one user',
  })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOneById(id);
  }

  // update user
  @ApiTags('API-Users')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    type: Boolean,
    description: 'Update user',
  })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<boolean> {
    return this.usersService.update(id, updateUserDto);
  }

  //delete user
  @ApiTags('API-Users')
  @ApiResponse({
    status: 200,
    type: Boolean,
    description: 'Delete user',
  })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number): Promise<boolean> {
    return this.usersService.remove(id);
  }
}

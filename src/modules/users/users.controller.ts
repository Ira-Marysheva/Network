import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthAnswerDTO } from './response';
import User from './entities/user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<AuthAnswerDTO> {
    return this.usersService.create(createUserDto);
  }

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // findAll(@Req() req) {
  //   return this.usersService.findAll(+req.user.id);
  // }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number): Promise<DeleteResult> {
    return this.usersService.remove(id);
  }
}

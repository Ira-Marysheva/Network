import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthAnswerDTO } from './response';
import User from './entities/user.entity';
import { ApiBody, ApiResponse, ApiTags} from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from "../auth/roles.decorator";
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file, @Body() createUserDto: CreateUserDto): Promise<AuthAnswerDTO> {
    const fileUrl = `http://localhost:3000/uploads/${file.filename}`;
    return this.usersService.create(createUserDto, fileUrl);
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
  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: number): Promise<boolean> {
    return this.usersService.remove(id);
  }  

  //  UPDATE UPLOAD IMAGE POST FOR ID
  @ApiTags('API-Post-Image')
  @ApiResponse({
    status: 200,
    type: User,
    description: 'Update upload image to user post',
  })
  @Roles(['user'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/uploadImage/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateUploadImage(@UploadedFile() file, @Param('id') id:string):Promise<boolean> {
    const fileUrl = `http://localhost:3000/uploads/${file.filename}`; 
    return this.usersService.updatePostUrl(+id,fileUrl) 
  }
}

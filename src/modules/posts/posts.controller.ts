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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(+req.user.id, createPostDto);
  }
  // get all users post
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    return this.postsService.findAll(+req.user.id);
  }
  // get one user comment for id comment
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req, @Param('id') id: string) {
    return this.postsService.findOne(+req.user.id, +id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Patch('like/:id')
  @UseGuards(JwtAuthGuard)
  likePost(@Param('id') id: string) {
    return this.postsService.likePost(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}

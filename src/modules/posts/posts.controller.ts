import {
  Controller,
  Get,
  Body,
  Post,
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
import { Posts } from './entities/post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req, @Body() createPostDto: CreatePostDto): Promise<Posts> {
    return this.postsService.create(+req.user.id, createPostDto);
  }

  // get all users post
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req): Promise<Posts[]> {
    return this.postsService.findAll(+req.user.id);
  }

  // get one user comment for id comment
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req, @Param('id') id: string): Promise<Posts> {
    return this.postsService.findOne(+req.user.id, +id);
  }

  //update exists user`s post
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<boolean> {
    return this.postsService.update(+id, updatePostDto);
  }

  //delete exist post
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string): Promise<boolean> {
    return this.postsService.remove(+id);
  }
  // get list who like post
  @Get('like/:id')
  @UseGuards(JwtAuthGuard)
  getAllLike(@Req() req, @Param('id') id: string): Promise<Posts> {
    return this.postsService.getAllLike(+req.user.id, +id);
  }

  //liked
  @Patch('like/:id')
  @UseGuards(JwtAuthGuard)
  likePost(@Req() req, @Param('id') id: string): Promise<Posts> {
    return this.postsService.like(+req.user.id, +id);
  }
  //delete like
  @Patch('likeDelete/:id')
  @UseGuards(JwtAuthGuard)
  deleteLikePost(@Req() req, @Param('id') id: string): Promise<Posts> {
    return this.postsService.deleteLike(+req.user.id, +id);
  }
}

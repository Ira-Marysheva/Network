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
import { ApiTags, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiTags('API-Post')
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({
    status: 201,
    type: Posts,
    description: 'Create post',
  })
  @ApiQuery({ name: 'req.user.id', type: Number })
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req, @Body() createPostDto: CreatePostDto): Promise<Posts> {
    return this.postsService.create(+req.user.id, createPostDto);
  }

  // get all users post
  @ApiTags('API-Post')
  @ApiResponse({
    status: 200,
    type: [Posts],
    description: 'Get all user`s post',
  })
  @ApiQuery({ name: 'req.user.id', type: Number })
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req): Promise<Posts[]> {
    return this.postsService.findAll(+req.user.id);
  }

  // get one user post for id post
  @ApiTags('API-Post')
  @ApiResponse({
    status: 200,
    type: Posts,
    description: 'Get one user`s post',
  })
  @ApiQuery({ name: 'req.user.id', type: Number })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req, @Param('id') id: string): Promise<Posts> {
    return this.postsService.findOne(+req.user.id, +id);
  }

  //update exists user`s post
  @ApiTags('API-Post')
  @ApiResponse({ type: UpdatePostDto })
  @ApiResponse({
    status: 200,
    type: Boolean,
    description: 'Update one user`s post',
  })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<boolean> {
    return this.postsService.update(+id, updatePostDto);
  }

  //delete exist post
  @ApiTags('API-Post')
  @ApiResponse({
    status: 200,
    type: Boolean,
    description: 'Delete one user`s post',
  })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string): Promise<boolean> {
    return this.postsService.remove(+id);
  }

  // like post logic

  // get list who like post
  @ApiTags('API-Post-Like')
  @ApiResponse({
    status: 200,
    type: Posts,
    description: 'Get all user who like post',
  })
  @ApiQuery({ name: 'req.user.id', type: Number })
  @Get('like/:id')
  @UseGuards(JwtAuthGuard)
  getAllLike(@Req() req, @Param('id') id: string): Promise<Posts> {
    return this.postsService.getAllLike(+req.user.id, +id);
  }

  //liked
  @ApiTags('API-Post-Like')
  @ApiResponse({
    status: 200,
    type: Posts,
    description: 'liked post',
  })
  @ApiQuery({ name: 'req.user.id', type: Number })
  @Patch('like/:id')
  @UseGuards(JwtAuthGuard)
  likePost(@Req() req, @Param('id') id: string): Promise<Posts> {
    return this.postsService.like(+req.user.id, +id);
  }
  //delete like
  @ApiTags('API-Post-Like')
  @ApiResponse({
    status: 200,
    type: Posts,
    description: 'Delete like from user post',
  })
  @ApiQuery({ name: 'req.user.id', type: Number })
  @Patch('likeDelete/:id')
  @UseGuards(JwtAuthGuard)
  deleteLikePost(@Req() req, @Param('id') id: string): Promise<Posts> {
    return this.postsService.deleteLike(+req.user.id, +id);
  }
}

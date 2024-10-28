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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Comment } from './entities/comment.entity';
import { ApiTags, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // create new comment for idPost post
  @ApiTags('API-Comment')
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({
    status: 201,
    type: Comment,
    description: 'Create comment',
  })
  @ApiQuery({ name: 'idUser', type: Number })
  @ApiQuery({ name: 'req.user.id', type: Number })
  @Post('/post/:idPost')
  @UseGuards(JwtAuthGuard)
  create(
    @Req() req,
    @Param('idPost') idPost: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.create(+req.user.id, +idPost, createCommentDto);
  }

  // all comment for one post
  @ApiTags('API-Comment')
  @ApiResponse({
    status: 200,
    type: [Comment],
    description: 'Get all comments for one post',
  })
  @Get('/post/:idPost')
  // @s(JwtAuthGuard)
  findAll(@Param('idPost') idPost: string): Promise<Comment[]> {
    return this.commentsService.findAll(+idPost);
  }
  // get one comment
  @ApiTags('API-Comment')
  @ApiResponse({
    status: 200,
    type: Comment,
    description: 'Get one comment',
  })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string): Promise<Comment> {
    return this.commentsService.findOne(+id);
  }

  // update exist comment in post
  @ApiTags('API-Comment')
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({
    status: 200,
    type: Comment,
    description: 'Update comment',
  })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<boolean> {
    return this.commentsService.update(+id, updateCommentDto);
  }

  //delete exist comment for id in post
  @ApiTags('API-Comment')
  @ApiResponse({
    status: 200,
    type: Boolean,
    description: 'Delete comment',
  })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string): Promise<boolean> {
    return this.commentsService.remove(+id);
  }

  // get list who like comment
  @ApiTags('API-Comment-Like')
  @ApiResponse({
    status: 200,
    type: Comment,
    description: 'Get list users who like comment',
  })
  @ApiQuery({ name: 'req.user.id', type: Number })
  @Get('like/:id')
  @UseGuards(JwtAuthGuard)
  getAllLike(@Req() req, @Param('id') id: string): Promise<Comment> {
    return this.commentsService.getAllLike(+req.user.id, +id);
  }

  //liked
  @ApiTags('API-Comment-Like')
  @ApiResponse({
    status: 200,
    type: Comment,
    description: 'Like comment',
  })
  @ApiQuery({ name: 'req.user.id', type: Number })
  @Patch('like/:id')
  @UseGuards(JwtAuthGuard)
  likePost(@Req() req, @Param('id') id: string): Promise<Comment> {
    return this.commentsService.like(+req.user.id, +id);
  }
  //delete like
  @ApiTags('API-Comment-Like')
  @ApiResponse({
    status: 200,
    type: Comment,
    description: 'Delete like comment',
  })
  @ApiQuery({ name: 'req.user.id', type: Number })
  @Patch('likeDelete/:id')
  @UseGuards(JwtAuthGuard)
  deleteLikePost(@Req() req, @Param('id') id: string): Promise<Comment> {
    return this.commentsService.deleteLike(+req.user.id, +id);
  }
}

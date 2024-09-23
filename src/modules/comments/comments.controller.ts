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

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // create new comment for idPost post
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
  @Get('/post/:idPost')
  @UseGuards(JwtAuthGuard)
  findAll(@Param('idPost') idPost: string): Promise<Comment[]> {
    return this.commentsService.findAll(+idPost);
  }
  // get one comment
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string): Promise<Comment> {
    return this.commentsService.findOne(+id);
  }

  // update exist comment in post
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<boolean> {
    return this.commentsService.update(+id, updateCommentDto);
  }

  //delete exist comment for id in post
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string): Promise<boolean> {
    return this.commentsService.remove(+id);
  }

  // get list who like comment
  @Get('like/:id')
  @UseGuards(JwtAuthGuard)
  getAllLike(@Req() req, @Param('id') id: string): Promise<Comment> {
    return this.commentsService.getAllLike(+req.user.id, +id);
  }

  //liked
  @Patch('like/:id')
  @UseGuards(JwtAuthGuard)
  likePost(@Req() req, @Param('id') id: string): Promise<Comment> {
    return this.commentsService.like(+req.user.id, +id);
  }
  //delete like
  @Patch('likeDelete/:id')
  @UseGuards(JwtAuthGuard)
  deleteLikePost(@Req() req, @Param('id') id: string): Promise<Comment> {
    return this.commentsService.deleteLike(+req.user.id, +id);
  }
}

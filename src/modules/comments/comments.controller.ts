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

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/post/:idPost')
  @UseGuards(JwtAuthGuard)
  create(
    @Req() req,
    @Param('idPost') idPost: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(+req.user.id, +idPost, createCommentDto);
  }
  // all comment for one post
  @Get('/post/:idPost')
  @UseGuards(JwtAuthGuard)
  findAll(@Param('idPost') idPost: string) {
    return this.commentsService.findAll(+idPost);
  }
  // get one comment
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Patch('like/:id')
  @UseGuards(JwtAuthGuard)
  likePost(@Param('id') id: string) {
    return this.commentsService.likePost(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(id: number, idPost: number, createCommentDto: CreateCommentDto) {
    return await this.commentRepository.save({
      text: createCommentDto.text,
      likeQty: createCommentDto.likeQty,
      user: { id },
      post: { id: idPost },
    });
  }

  async findAll(idPost: number) {
    const postComment = await this.commentRepository.find({
      where: { post: { id: idPost } },
      relations: { user: true, post: true },
    });
    if (!postComment.length)
      throw new BadRequestException('This post is not exist');
    return postComment;
  }

  async findOne(id: number) {
    const comment = await this.commentRepository.find({
      where: { id },
      relations: { user: true, post: true },
    });
    if (!comment.length)
      throw new BadRequestException('This comment not exist');
    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentRepository.find({
      where: { id },
      relations: { user: true, post: true },
    });
    if (!comment.length)
      throw new BadRequestException('This comment not exist');
    return await this.commentRepository.update(id, updateCommentDto);
  }

  async likePost(id: number) {
    const comment = await this.commentRepository.find({
      where: { id },
      relations: { user: true },
    });
    if (!comment) throw new BadRequestException('This post not exist!');
    return await this.commentRepository.update(id, {
      likeQty: comment[0].likeQty + 1,
    });
  }

  async remove(id: number) {
    const comment = await this.commentRepository.find({
      where: { id },
      relations: { user: true, post: true },
    });
    if (!comment.length)
      throw new BadRequestException('This comment not exist');
    return await this.commentRepository.delete(id);
  }
}

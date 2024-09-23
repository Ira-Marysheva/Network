import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly usersService: UsersService,
  ) {}

  async create(
    id: number,
    idComment: number,
    createCommentDto: CreateCommentDto,
  ) {
    return await this.commentRepository.save({
      text: createCommentDto.text,
      likeQty: createCommentDto.likeQty,
      user: { id },
      post: { id: idComment },
    });
  }

  async findAll(idComment: number) {
    const postComment = await this.commentRepository.find({
      where: { post: { id: idComment } },
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

  async getAllLike(idUser: number, idComment: number) {
    const user = await this.usersService.findOneById(idUser);
    if (!user) throw new BadRequestException('This user not exist!');

    const likedComment = await this.commentRepository.findOne({
      where: { id: idComment, userLiked: [{ id: idUser }] },
      relations: { userLiked: true },
    });
    console.log(likedComment);
    if (!likedComment)
      throw new BadRequestException('This like to comment not exist!');
    return likedComment;
  }

  async like(idUser: number, idComment: number) {
    const comment = await this.commentRepository.findOne({
      where: { id: idComment },
      relations: { userLiked: true },
      // relations: { user: true, comment: true },
    });
    if (!comment) throw new BadRequestException('This comment not exist!');

    const user = await this.usersService.findOneById(idUser);
    if (!user) throw new BadRequestException('This user not exist!');

    const likedComment = await this.commentRepository.findOne({
      where: { id: idComment, userLiked: [{ id: idUser }] },
      relations: { user: true, userLiked: true },
    });
    console.log(likedComment);
    if (likedComment)
      throw new BadRequestException('User has already liked comment');

    console.log('comment.userLiked', comment.userLiked);

    comment.likeQty = comment.likeQty + 1;
    comment.userLiked = [...comment.userLiked, user[0]];
    await this.commentRepository.save(comment);

    return comment;
  }

  async deleteLike(idUser: number, idComment: number) {
    const user = await this.usersService.findOneById(idUser);
    if (!user) throw new BadRequestException('This user not exist!');

    const likedComment = await this.commentRepository.findOne({
      where: { id: idComment, userLiked: [{ id: idUser }] },
      relations: { user: true, userLiked: true },
    });
    if (!likedComment) throw new BadRequestException('This comment not exist!');
    if (likedComment) {
      likedComment.userLiked = likedComment.userLiked.filter((user) => {
        return user.id !== idUser;
      });
      likedComment.likeQty = likedComment.likeQty - 1;
      return this.commentRepository.save(likedComment);
    }
    throw new BadRequestException('something happening wrong');
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

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

  // create new comment
  async create(
    idUser: number,
    idComment: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    try {
      return await this.commentRepository.save({
        text: createCommentDto.text,
        likeQty: createCommentDto.likeQty,
        user: { id: idUser },
        post: { id: idComment },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  //get all comment in post
  async findAll(idComment: number): Promise<Comment[]> {
    const postComment = await this.commentRepository.find({
      where: { post: { id: idComment } },
      relations: { user: true, post: true },
    });
    if (!postComment.length)
      throw new BadRequestException('This post is not exist');
    return postComment;
  }

  // get one for id comment
  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: { user: true, post: true },
    });
    if (!comment) throw new BadRequestException('This comment not exist');
    return comment;
  }

  // update exist comment
  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<boolean> {
    const comment = await this.commentRepository.find({
      where: { id },
      relations: { user: true, post: true },
    });
    if (!comment.length)
      throw new BadRequestException('This comment not exist');
    await this.commentRepository.update(id, updateCommentDto);
    return true;
  }

  // delete exist comment
  async remove(id: number): Promise<boolean> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: { user: true, post: true },
    });
    if (!comment) throw new BadRequestException('This comment not exist');
    await this.commentRepository.delete(id);
    return true;
  }

  async confirmExisting(idUser: number, idComment: number) {
    //confirm exist user
    const user = await this.usersService.findOneById(idUser);
    if (!user) throw new BadRequestException('This user not exist!');
    // confirm exist necessary comment

    const comment = await this.commentRepository.findOne({
      where: { id: idComment },
      relations: { userLiked: true },
    });
    if (!comment) throw new BadRequestException('This Comment not exist!');
    //confirm existing liked Comment

    const likedComment = await this.commentRepository.findOne({
      where: { id: idComment, userLiked: [{ id: idUser }] },
      relations: { userLiked: true },
    });

    return { likedComment, comment, user };
  }

  // get list of user who liked comment
  async getAllLike(idUser: number, idComment: number): Promise<Comment> {
    const { comment } = await this.confirmExisting(idUser, idComment);
    if (!comment)
      throw new BadRequestException('This like to comment not exist!');
    return comment;
  }

  //liked comment
  async like(idUser: number, idComment: number): Promise<Comment> {
    const { likedComment, comment, user } = await this.confirmExisting(
      idUser,
      idComment,
    );
    if (likedComment)
      throw new BadRequestException('User has already liked comment');
    comment.likeQty = comment.likeQty + 1;
    comment.userLiked = [...comment.userLiked, user];
    await this.commentRepository.save(comment);
    return comment;
  }

  // delete like in comment
  async deleteLike(idUser: number, idComment: number): Promise<Comment> {
    const { likedComment } = await this.confirmExisting(idUser, idComment);
    if (likedComment) {
      likedComment.userLiked = likedComment.userLiked.filter((user) => {
        return user.id !== idUser;
      });
      likedComment.likeQty = likedComment.likeQty - 1;
      return this.commentRepository.save(likedComment);
    }
    throw new BadRequestException('This comment not exist!');
  }
}

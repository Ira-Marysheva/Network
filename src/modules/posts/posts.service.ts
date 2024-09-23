import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Posts } from './entities/post.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts) private readonly postRepository: Repository<Posts>,
    private readonly usersService: UsersService,
  ) {}
  //create new post
  async create(id: number, createPostDto: CreatePostDto): Promise<Posts> {
    try {
      return await this.postRepository.save({
        text: createPostDto.text,
        likeQty: createPostDto.likeQty,
        user: { id },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  //find all login user`s post
  async findAll(id: number) {
    const posts = await this.postRepository.find({
      where: { user: { id } },
      relations: { user: true, comment: true },
    });
    if (!posts.length)
      throw new BadRequestException('Post with this params not exist!');
    return posts;
  }

  //find one user`s post
  async findOne(idUser: number, id: number): Promise<Posts> {
    const post = await this.postRepository.findOne({
      where: { id, user: { id: idUser } },
      relations: { user: true, comment: true },
    });
    if (!post)
      throw new BadRequestException('Post with this params not exist!');
    return post;
  }

  // update user`s post
  async update(
    id: number,
    updatePostDto: UpdatePostDto,
  ): Promise<UpdateResult> {
    const post = await this.postRepository.find({
      where: { id },
      relations: { user: true, comment: true },
    });
    if (!post.length) throw new BadRequestException('This post not exist!');
    return await this.postRepository.update(id, updatePostDto);
  }

  async confirmExisting(idUser: number, idPost: number) {
    //confirm exist user
    const user = await this.usersService.findOneById(idUser);
    if (!user) throw new BadRequestException('This user not exist!');
    // confirm exist necessary post

    const post = await this.postRepository.findOne({
      where: { id: idPost },
      relations: { userLiked: true },
    });
    if (!post) throw new BadRequestException('This post not exist!');
    //confirm existing liked post

    const likedPost = await this.postRepository.findOne({
      where: { id: idPost, userLiked: [{ id: idUser }] },
      relations: { userLiked: true },
    });

    return { likedPost, post, user };
  }

  // get list of user who liked post
  async getAllLike(idUser: number, idPost: number): Promise<Posts> {
    const { post } = await this.confirmExisting(idUser, idPost);
    if (!post)
      throw new BadRequestException(
        'This post not exist or user already liked!',
      );
    console.log(post);
    return post;
  }
  // like login user post
  async like(idUser: number, idPost: number) {
    const { post, user } = await this.confirmExisting(idUser, idPost);

    post.likeQty = post.likeQty + 1;
    post.userLiked = [...post.userLiked, user];
    await this.postRepository.save(post);

    return post;
  }
  //delete like login user
  async deleteLike(idUser: number, idPost: number): Promise<Posts> {
    const { likedPost } = await this.confirmExisting(idUser, idPost);
    if (likedPost) {
      likedPost.userLiked = likedPost.userLiked.filter((user) => {
        return user.id !== idUser;
      });
      likedPost.likeQty = likedPost.likeQty - 1;
      return this.postRepository.save(likedPost);
    }
    throw new BadRequestException('something happening wrong');
  }

  // delete exist users post
  async remove(id: number) {
    const post = await this.postRepository.find({
      where: { id },
      relations: { user: true, comment: true },
    });
    if (!post.length) throw new BadRequestException('This post not exist!');
    await this.postRepository.delete(id);
    return true;
  }
}

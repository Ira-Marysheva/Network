import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly usersService: UsersService,
  ) {}

  async create(id: number, createPostDto: CreatePostDto) {
    return await this.postRepository.save({
      text: createPostDto.text,
      likeQty: createPostDto.likeQty,
      user: { id },
    });
  }

  async findAll(id: number) {
    const posts = await this.postRepository.find({
      where: { user: { id } },
      relations: { user: true, comment: true },
    });
    if (!posts.length)
      throw new BadRequestException('Post with this params not exist!');
    return posts;
  }

  async findOne(idUser: number, id: number) {
    const post = await this.postRepository.findOne({
      where: { id, user: { id: idUser } },
      relations: { user: true, comment: true },
    });
    if (!post)
      throw new BadRequestException('Post with this params not exist!');
    return;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.find({
      where: { id },
      relations: { user: true, comment: true },
    });
    if (!post.length) throw new BadRequestException('This post not exist!');
    return await this.postRepository.update(id, updatePostDto);
  }

  async getAllLike(idUser: number, idPost: number) {
    const user = await this.usersService.findAll(idUser);
    if (!user.length) throw new BadRequestException('This user not exist!');

    const likedPost = await this.postRepository.findOne({
      where: { id: idPost, userLiked: [{ id: idUser }] },
      relations: { userLiked: true },
    });
    console.log(likedPost);
    if (!likedPost) throw new BadRequestException('This post not exist!');
    return likedPost;
  }

  async like(idUser: number, idPost: number) {
    const post = await this.postRepository.findOne({
      where: { id: idPost },
      relations: { userLiked: true },
      // relations: { user: true, comment: true },
    });
    if (!post) throw new BadRequestException('This post not exist!');

    const user = await this.usersService.findAll(idUser);
    if (!user.length) throw new BadRequestException('This user not exist!');

    const likedPost = await this.postRepository.findOne({
      where: { id: idPost, userLiked: [{ id: idUser }] },
      relations: { user: true, userLiked: true },
    });
    console.log(likedPost);
    if (likedPost) throw new BadRequestException('User has already liked post');

    console.log('post.userLiked', post.userLiked);

    post.likeQty = post.likeQty + 1;
    post.userLiked = [...post.userLiked, user[0]];
    await this.postRepository.save(post);

    return post;
  }

  async deleteLike(idUser: number, idPost: number) {
    const user = await this.usersService.findAll(idUser);
    if (!user.length) throw new BadRequestException('This user not exist!');

    const likedPost = await this.postRepository.findOne({
      where: { id: idPost, userLiked: [{ id: idUser }] },
      relations: { user: true, userLiked: true },
    });
    if (!likedPost) throw new BadRequestException('This post not exist!');
    if (likedPost) {
      likedPost.userLiked = likedPost.userLiked.filter((user) => {
        return user.id !== idUser;
      });
      likedPost.likeQty = likedPost.likeQty - 1;
      return this.postRepository.save(likedPost);
    }
    throw new BadRequestException('something happening wrong');
  }

  async remove(id: number) {
    const post = await this.postRepository.find({
      where: { id },
      relations: { user: true, comment: true },
    });
    if (!post.length) throw new BadRequestException('This post not exist!');
    return await this.postRepository.delete(id);
  }
}

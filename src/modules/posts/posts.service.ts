import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async create(id: number, createPostDto: CreatePostDto) {
    return await this.postRepository.save({
      text: createPostDto.text,
      likeQty: createPostDto.likeQty,
      user: { id },
    });
  }

  async findAll(id: number) {
    const posts = await this.postRepository.find({ where: { user: { id } } });
    if (!posts)
      throw new BadRequestException('Post with this params not exist!');
    return posts;
  }

  async findOne(idUser: number, id: number) {
    const post = await this.postRepository.findOne({
      where: { id, user: { id: idUser } },
    });
    if (!post)
      throw new BadRequestException('Post with this params not exist!');
    return;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.find({ where: { id } });
    if (!post) throw new BadRequestException('This post not exist!');
    return await this.postRepository.update(id, updatePostDto);
  }

  async likePost(id: number) {
    const post = await this.postRepository.find({
      where: { id },
      relations: { user: true },
    });
    if (!post) throw new BadRequestException('This post not exist!');
    return await this.postRepository.update(id, {
      likeQty: post[0].likeQty + 1,
    });
  }

  async remove(id: number) {
    const post = await this.postRepository.find({ where: { id } });
    if (!post) throw new BadRequestException('This post not exist!');
    return await this.postRepository.delete(id);
  }
}

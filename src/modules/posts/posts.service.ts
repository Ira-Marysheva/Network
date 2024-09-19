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
    private readonly userServise: UsersService,
  ) {}

  async create(id: number, createPostDto: CreatePostDto) {
    return await this.postRepository.save({
      text: createPostDto.text,
      likeQty: createPostDto.likeQty,
      user: { id },
    });
  }

  async findAll(id: number) {
    const user = await this.userServise.findAll(id);
    if (!user)
      throw new BadRequestException('User with this params not exist!');
    return await this.postRepository.find({ where: { user: { id } } });
  }

  async findOne(idUser: number, id: number) {
    const user = await this.userServise.findAll(idUser);
    if (!user)
      throw new BadRequestException('User with this params not exist!');
    return await this.postRepository.findOne({
      where: { id },
      relations: { user: true },
    });
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

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

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}

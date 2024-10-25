import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Posts } from './entities/post.entity';
import { Repository } from 'typeorm';
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
  async update(id: number, updatePostDto: UpdatePostDto): Promise<boolean> {
    const post = await this.postRepository.find({
      where: { id },
      relations: { user: true, comment: true },
    });
    if (!post.length) throw new BadRequestException('This post not exist!');
    await this.postRepository.update(id, updatePostDto);
    return true;
  }

  // delete exist users post
  async remove(id: number): Promise<boolean> {
    const post = await this.postRepository.find({
      where: { id },
      relations: { user: true, comment: true },
    });
    if (!post.length) throw new BadRequestException('This post not exist!');
    await this.postRepository.delete(id);
    return true;
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


  // filter function for search post
  async filterTextPost(keyWord:string){
    try {
      const word = keyWord.split(' ')
      return this.postRepository.createQueryBuilder('post').where('post.text ILIKE :word', {word: `%${word[0]}%`}).getMany()
    } catch (error) {
      console.log(error)  
    }
  }
  // filter function for search post for date created
  async filterDatePost(startDate:Date, endDate:Date):Promise<Posts[]>{
    let findedPosts = []
    if (startDate && endDate){
      console.log('here')
      findedPosts = await this.postRepository.createQueryBuilder('post').where('post.timeCteated >= :startDate AND post.timeCteated <= :endDate', {startDate:`${startDate} 00:00:00.000`, endDate: `${endDate} 23:59:59.999`}).getMany()
    }else if (startDate){
      findedPosts =await this.postRepository.createQueryBuilder('post').where('post.timeCteated >= :startDate', {startDate:`${startDate} 00:00:00.000`}).getMany()
    }else if (endDate){
      findedPosts = await this.postRepository.createQueryBuilder('post').where('post.timeCteated <= :endDate', {endDate:`${endDate} 23:59:59.999`}).getMany()
    }else{
      throw new BadRequestException('Please enter at least one date in one of the parameters')
    }
    console.log(startDate, endDate)
    return findedPosts
  }

  // filter(sorting) post for like quantity
  async filterLikePost():Promise<Posts[]>{
    return await this.postRepository.createQueryBuilder('post')
    .orderBy('post.likeQty', 'DESC') 
    .getMany();
  }
}


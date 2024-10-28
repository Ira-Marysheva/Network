import {
  Controller,
  Get,
  Body,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Posts } from './entities/post.entity';
import { ApiTags, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import filterDataPostDto from './dto/filter-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';


@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  
  // FILTER POSTS
  
  // get all post by text in post
  @ApiTags('API-Post-Filter')
  @ApiResponse({
    status: 200,
    type: Posts,
    description: 'Get all post by text',
  })
  @ApiQuery({ name: 'keyWord', type: String })
  @Get('filter-text-post') 
  @UseGuards(JwtAuthGuard)
  getFilterTextPost(@Body('keyWord') keyWord:string):Promise<Posts[]> {
    return this.postsService.filterTextPost(keyWord)
  }
  
  // get all post by data created
  @ApiTags('API-Post-Filter')
  @ApiResponse({
    status: 200,
    type: Posts,
    description: 'Get all post by data created',
  })
  @ApiBody({ type: filterDataPostDto })
  @Get('filter-date-post')
  @UseGuards(JwtAuthGuard)
  getFlterDataPost(@Body() filterDataPost: filterDataPostDto):Promise<Posts[]>{
    const {startDate, endDate} = filterDataPost
    return this.postsService.filterDatePost(startDate, endDate)
  }

  // get all post by like quantity
  @ApiTags('API-Post-Filter')
  @ApiResponse({
    status: 200,
    type: Posts,
    description: 'get all post by like quantity(sorting)',
  })
  @Get('filter-like-post')
  @UseGuards(JwtAuthGuard)
  getFilterLikePost():Promise<Posts[]> {
    return this.postsService.filterLikePost()
  }

  // create post 
  @ApiTags('API-Post')
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({
    status: 201,
    type: Posts,
    description: 'Create post',
  })
  @ApiQuery({ name: 'req.user.id', type: Number })
  @Post()
  @Roles(['user'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file, @Req() req, @Body() createPostDto: CreatePostDto): Promise<Posts> {
    const fileUrl = `http://localhost:3000/uploads/${file.filename}`;
    return this.postsService.create(+req.user.id, createPostDto, fileUrl);
  }
  
  // get all users post
  @ApiTags('API-Post')
  @ApiResponse({
    status: 200,
    type: [Posts],
    description: 'Get all user`s post',
  })
  @ApiQuery({ name: 'req.user.id', type: Number })
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req): Promise<Posts[]> {
    return this.postsService.findAll(+req.user.id);
  }

  // get one user post for id post
  @ApiTags('API-Post')
  @ApiResponse({
    status: 200,
    type: Posts,
    description: 'Get one user`s post',
  })
  @ApiQuery({ name: 'req.user.id', type: Number })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req, @Param('id') id: string): Promise<Posts> {
    return this.postsService.findOne(+req.user.id, +id);
  }

  //update exists user`s post
  @ApiTags('API-Post')
  @ApiResponse({ type: UpdatePostDto })
  @ApiResponse({
    status: 200,
    type: Boolean,
    description: 'Update one user`s post',
  })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<boolean> {
    return this.postsService.update(+id, updatePostDto);
  }

  //delete exist post
  @ApiTags('API-Post')
  @ApiResponse({
    status: 200,
    type: Boolean,
    description: 'Delete one user`s post',
  })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string): Promise<boolean> {
    return this.postsService.remove(+id);
  }

  // LIKE POST LOGIC
  // get list who like post
  @ApiTags('API-Post-Like')
  @ApiResponse({
    status: 200,
    type: Posts,
    description: 'Get all user who like post',
  })
  @ApiQuery({ name: 'req.user.id', type: Number })
  @Get('like/:id')
  @UseGuards(JwtAuthGuard)
  getAllLike(@Req() req, @Param('id') id: string): Promise<Posts> {
    return this.postsService.getAllLike(+req.user.id, +id);
  }

  //liked
  @ApiTags('API-Post-Like')
  @ApiResponse({
    status: 200,
    type: Posts,
    description: 'liked post',
  })
  @ApiQuery({ name: 'req.user.id', type: Number })
  @Patch('like/:id')
  @UseGuards(JwtAuthGuard)
  likePost(@Req() req, @Param('id') id: string): Promise<Posts> {
    return this.postsService.like(+req.user.id, +id);
  }
  //delete like
  @ApiTags('API-Post-Like')
  @ApiResponse({
    status: 200,
    type: Posts,
    description: 'Delete like from user post',
  })
  @ApiQuery({ name: 'req.user.id', type: Number })
  @Patch('likeDelete/:id')
  @UseGuards(JwtAuthGuard)
  deleteLikePost(@Req() req, @Param('id') id: string): Promise<Posts> {
    return this.postsService.deleteLike(+req.user.id, +id);
  }

  //  UPDATE UPLOAD IMAGE POST FOR ID
  @ApiTags('API-Post')
  @ApiResponse({
    status: 200,
    type: Posts,
    description: 'Update upload image to user post',
  })
  @Roles(['user'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/uploadImage/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateUploadImage(@UploadedFile() file, @Param('id') id:string):Promise<boolean> {
    const fileUrl = `http://localhost:3000/uploads/${file.filename}`; 
    return this.postsService.updatePostUrl(+id,fileUrl) 
  }
    
}

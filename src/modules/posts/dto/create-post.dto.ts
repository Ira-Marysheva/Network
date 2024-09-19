import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsNumber()
  @IsOptional()
  likeQty?: number;
}

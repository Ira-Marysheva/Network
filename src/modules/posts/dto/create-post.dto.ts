import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  likeQty?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  postPhotoUrl?: string;
}

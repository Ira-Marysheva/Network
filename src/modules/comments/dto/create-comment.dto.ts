import { IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  text: string;
  @IsOptional()
  likeQty?: number;
}

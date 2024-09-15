import { IsNotEmpty, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  @MinLength(6)
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  gender: 'man' | 'woman' | 'not answered';

  // @IsOptional()
  // friendList?: string;
}

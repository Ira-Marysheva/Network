import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class PublicUserDTO {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  @MinLength(6)
  email: string;

  @IsNotEmpty()
  gender: string;
}

export class AuthAnswerDTO {
  user: PublicUserDTO;

  @IsString()
  token: string;
}

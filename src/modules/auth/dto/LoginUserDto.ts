import { IsNotEmpty } from 'class-validator';
export class LoginUserDto {
  @IsNotEmpty()
  idUser: number;
  @IsNotEmpty()
  email: string;
}

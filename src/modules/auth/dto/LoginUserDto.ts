import { IsNotEmpty } from 'class-validator';
export class LoginUserDto {
  @IsNotEmpty()
  userName: string;
  @IsNotEmpty()
  email: string;
}

import { IsNotEmpty } from 'class-validator';
export class LoginUserDto {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  email: string;
}

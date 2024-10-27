import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  email: string;

  @ApiProperty()
  // @ApiProperty({ type: String })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: ['man', 'woman', 'not answered'] })
  @IsNotEmpty()
  gender: 'man' | 'woman' | 'not answered';

  @ApiProperty({enum:['admin', 'user']})
  roles: 'admin' | 'user';
  
  // @IsOptional()
  // friendList?: string;
}

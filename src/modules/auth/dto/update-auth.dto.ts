import { PartialType } from '@nestjs/mapped-types';
import { LoginUserDto } from './LoginUserDto';

export class UpdateAuthDto extends PartialType(LoginUserDto) {}

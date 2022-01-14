import { IsString, MaxLength, MinLength } from 'class-validator';

export class UserDto {
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  userName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(150)
  description: string;
}

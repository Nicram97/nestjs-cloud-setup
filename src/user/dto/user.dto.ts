import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UserDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  userName: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  description: string;
}

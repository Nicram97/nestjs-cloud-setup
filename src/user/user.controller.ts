import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from '../entity/user';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post('/')
  async createUser(@Body() createUser: UserDto): Promise<User> {
    return this.userService.addUser(createUser);
  }
}

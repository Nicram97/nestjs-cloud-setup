import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { User } from '../entity/user.entity';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'getAllUsers' })
  @ApiOkResponse({
    status: 200,
    description: 'Return list of users created it database',
  })
  @Get('/')
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @ApiOperation({ summary: 'GetUserById' })
  @ApiOkResponse({
    status: 200,
    description: 'Return User Entity with specified id',
  })
  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.getUserById(id);
  }

  @ApiOperation({ summary: 'getAllUsers' })
  @ApiCreatedResponse({
    status: 201,
    description:
      'Using provided body create user and save it in the database then if succeeded return created user',
  })
  @Post('/')
  async createUser(@Body() createUser: UserDto): Promise<User> {
    return this.userService.addUser(createUser);
  }
}

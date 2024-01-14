import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/')
  getUsers() {
    return this.userService.getUsers();
  }

  @Get('/:id')
  getUserDetails(@Param('id') userId: string) {
    return this.userService.getUserDetails(userId);
  }

  @Get('/:id/referrals')
  getUserReferees(@Param('id') userId: string) {
    return this.userService.getUserReferees(userId);
  }

  @Get('/:id/points')
  getUserPoints(@Param('id') userId: string) {
    return this.userService.getUserPoints(userId);
  }
}

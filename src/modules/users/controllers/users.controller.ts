import { Controller, Get, Post, Body, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create/accounts')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('accounts')
  getProfile(@Req() req) {
    return this.usersService.findOne(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update/accounts')
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.userId, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/accounts')
  remove(@Req() req) {
    return this.usersService.remove(req.user.userId);
  }
}
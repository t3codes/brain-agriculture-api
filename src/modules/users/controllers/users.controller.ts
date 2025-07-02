import { Controller, Get, Post, Body, Patch, Put, Delete, UseGuards, Req, Param } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthRole } from 'src/decorators/user.role.decorator';
import { Role } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

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
  @Delete('delete/accounts/:id')
  remove(@Param('id') id: string, @Req() req) {
    return this.usersService.remove(+id, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/toggle-role')
  async toggleRole(
    @Param('id') id: string,
    @Body() body: { role: Role },
    @Req() req: { user: { id: number; role: Role, superuser: boolean } } 
  ) {
    return this.usersService.toggleUserRole(+id, body.role, req.user);
  }


}
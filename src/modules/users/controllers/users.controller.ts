import { Controller, Get, Post, Body, Patch, Put, Delete, UseGuards, Req, Param } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CreateUserSwagger, GetProfileSwagger, UpdateUserSwagger, RemoveUserSwagger, ToggleRoleSwagger } from '../swagger/users.swagger';


@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('create/accounts')
  @CreateUserSwagger()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @GetProfileSwagger()
  @Get('accounts')
  getProfile(@Req() req) {
    return this.usersService.findOne(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update/accounts')
  @UpdateUserSwagger()
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.userId, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @RemoveUserSwagger()
  @Delete('delete/accounts/:id')
  remove(@Param('id') id: string, @Req() req) {
    return this.usersService.remove(+id, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @ToggleRoleSwagger()
  @Put(':id/toggle-role')
  async toggleRole(
    @Param('id') id: string,
    @Body() body: { role: Role },
    @Req() req: { user: { id: number; role: Role, superuser: boolean } }
  ) {
    return this.usersService.toggleUserRole(+id, body.role, req.user);
  }


}
import { Role } from '@prisma/client';
import {
  applyDecorators,
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler()) ?? [];
    if (roles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !roles.includes(user.role)) {
      throw new ForbiddenException('Acesso negado');
    }
    return true;
  }
}

export function AuthRole(...roles: Role[]) {
  return applyDecorators(
    UseGuards(AuthGuard('jwt'), RolesGuard),
    SetMetadata('roles', roles),
  );
}

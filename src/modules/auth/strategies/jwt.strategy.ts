import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client'; // Importe o enum Role do Prisma

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: { sub: number; email: string }): Promise<{
    userId: number;
    email: string;
    role: Role; 
    superuser: boolean;
  }> {
    console.log('Payload do JWT:', payload);
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, superuser: true },
    });
    console.log('Usuário encontrado no banco de dados:', user);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      superuser: user.superuser, 
    };
  }
}
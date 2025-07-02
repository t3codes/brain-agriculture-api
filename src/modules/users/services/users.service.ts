import { Injectable, NotFoundException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User, Producer, Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { name, email, password } = createUserDto;
    const emailExists = await this.prisma.user.findUnique({
      where: { email },
    });
    if (emailExists) throw new ConflictException('E-mail já cadastrado');
    const userCount = await this.prisma.user.count();
    const role = userCount === 0 ? Role.ADMIN : Role.FARMER;
    const superuser = userCount === 0 ? true : false;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        superuser,
      },
    });
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Lista todos os usuários COM seus produtores (opcional)
  async findAll(): Promise<(User & { producers: Producer[] })[]> {
    return this.prisma.user.findMany({
      include: { producers: true }, // 👈 Carrega os relacionamentos
    });
  }

  // Busca um usuário por ID (com produtores associados)
  async findOne(id: number): Promise<User & { producers: Producer[] }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { producers: true }, // 👈 Inclui os produtores
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Atualiza um usuário
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id); // Verifica se usuário existe

    let hashedPassword: string | undefined = undefined;

    if (updateUserDto.password) {
      hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
        ...(hashedPassword ? { password: hashedPassword } : {}), // só atualiza se hash existir
      },
    });
  }


  async remove(id: number, authUser: { id: number; role: Role }): Promise<User> {
    if (authUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Apenas administradores podem deletar usuários.');
    }
    if (authUser.id === id) {
      throw new ForbiddenException('Por segurança, Você não pode deletar sua própria conta.');
    }
    const user = await this.findOne(id);
    console.log("User to be deleted:", user);
    return this.prisma.user.delete({
      where: { id },
    });
  }


  async toggleUserRole(
    targetUserId: number,
    newRole: Role,
    authUser: { id: number; role: Role; superuser: boolean }
  ): Promise<Omit<User, 'password'>> {
    if (authUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Apenas administradores podem alterar papéis de usuários.');
    }
    if (authUser.id === targetUserId) {
      throw new ForbiddenException('Você não pode alterar seu próprio papel.');
    }
    if (!authUser.superuser) {
      throw new ForbiddenException('As permissões deste usuário, não podem ser auteradas.');
    }
    if (!Object.values(Role).includes(newRole)) {
      throw new BadRequestException('Role inválida');
    }
    const user = await this.findOne(targetUserId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    const updatedUser = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    });

    // Aqui, você pode invalidar o token atual, forçando o usuário a se logar novamente.
    // Isso pode ser feito removendo o refresh token ou forçando uma expiração imediata no lado do cliente.

    // Remover a senha antes de retornar o usuário atualizado
    const { password, ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
  }



  async getUserProducers(userId: number): Promise<Producer[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { producers: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user.producers;
  }
}
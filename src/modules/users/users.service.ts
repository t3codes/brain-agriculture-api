import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User, Producer } from '@prisma/client'; // 👈 Tipos gerados pelo Prisma

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { name, email, password } = createUserDto;

    const emailExists = await this.prisma.user.findUnique({ where: { email } });
    if (emailExists) throw new ConflictException('E-mail já cadastrado');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Retorna usuário sem o campo `password`
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


  // Remove um usuário (e seus produtores em cascata, se configurado no schema)
  async remove(id: number): Promise<User> {
    await this.findOne(id); // 👈 Valida se o usuário existe
    return this.prisma.user.delete({
      where: { id },
    });
  }

  // --- MÉTODOS ADICIONAIS PARA GERENCIAR PRODUTORES DO USUÁRIO ---
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
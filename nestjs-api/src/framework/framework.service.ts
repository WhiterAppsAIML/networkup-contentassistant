import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFrameworkDto, UpdateFrameworkDto } from './dto/framework.dto';

@Injectable()
export class FrameworkService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateFrameworkDto) {
    return this.prisma.framework.create({
      data: { userId, name: dto.name, structure: dto.structure, description: dto.description },
    });
  }

  async list(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.framework.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.framework.count({ where: { userId } }),
    ]);
    return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
  }

  async getById(id: string, userId: string) {
    const framework = await this.prisma.framework.findFirst({ where: { id: BigInt(id), userId } });
    if (!framework) throw new NotFoundException('Framework not found');
    return framework;
  }

  async update(id: string, userId: string, dto: UpdateFrameworkDto) {
    const framework = await this.prisma.framework.findFirst({ where: { id: BigInt(id), userId } });
    if (!framework) throw new NotFoundException('Framework not found');

    return this.prisma.framework.update({
      where: { id: BigInt(id) },
      data: { name: dto.name, structure: dto.structure, description: dto.description },
    });
  }

  async remove(id: string, userId: string) {
    const framework = await this.prisma.framework.findFirst({ where: { id: BigInt(id), userId } });
    if (!framework) throw new NotFoundException('Framework not found');

    await this.prisma.framework.delete({ where: { id: BigInt(id) } });
    return { message: 'Framework deleted' };
  }
}
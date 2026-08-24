import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCtaDto, UpdateCtaDto } from './dto/cta.dto';

@Injectable()
export class CtaService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateCtaDto) {
    return this.prisma.cTA.create({ data: { userId, text: dto.text, type: dto.type } });
  }

  async list(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.cTA.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.cTA.count({ where: { userId } }),
    ]);
    return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
  }

  async getById(id: string, userId: string) {
    const cta = await this.prisma.cTA.findFirst({ where: { id: BigInt(id), userId } });
    if (!cta) throw new NotFoundException('CTA not found');
    return cta;
  }

  async update(id: string, userId: string, dto: UpdateCtaDto) {
    const cta = await this.prisma.cTA.findFirst({ where: { id: BigInt(id), userId } });
    if (!cta) throw new NotFoundException('CTA not found');

    return this.prisma.cTA.update({
      where: { id: BigInt(id) },
      data: { text: dto.text, type: dto.type },
    });
  }

  async remove(id: string, userId: string) {
    const cta = await this.prisma.cTA.findFirst({ where: { id: BigInt(id), userId } });
    if (!cta) throw new NotFoundException('CTA not found');

    await this.prisma.cTA.delete({ where: { id: BigInt(id) } });
    return { message: 'CTA deleted' };
  }
}
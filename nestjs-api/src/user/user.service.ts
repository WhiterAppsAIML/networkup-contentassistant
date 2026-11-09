import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserTier } from '../common/decorators/require-tier.decorator';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, tier: true, createdAt: true, firebaseUid: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getUsageStats(userId: string) {
    const [contentCount, hookCount, leadMagnetCount, frameworkCount, ctaCount, scheduledCount, ragCount] = await Promise.all([
      this.prisma.content.count({ where: { userId } }),
      this.prisma.hook.count({ where: { userId } }),
      this.prisma.leadMagnet.count({ where: { userId } }),
      this.prisma.framework.count({ where: { userId } }),
      this.prisma.cTA.count({ where: { userId } }),
      this.prisma.scheduledPost.count({ where: { userId } }),
      this.prisma.ragDocument.count({ where: { userId } }),
    ]);

    return {
      content: contentCount,
      hooks: hookCount,
      leadMagnets: leadMagnetCount,
      frameworks: frameworkCount,
      ctas: ctaCount,
      scheduledPosts: scheduledCount,
      ragDocuments: ragCount,
    };
  }

  async upgradeTier(userId: string, tier: 'GROWTH' | 'ENTERPRISE') {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { tier: tier as UserTier },
      select: { id: true, email: true, tier: true },
    });
    return user;
  }
}
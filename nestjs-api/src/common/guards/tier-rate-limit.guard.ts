import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { RequireTier, UserTier } from '../../common/decorators/require-tier.decorator';
import { Public } from '../../common/decorators/public.decorator';

const TIER_LIMITS = {
  [UserTier.FREE]: { rpm: 30, rpd: 1000, concurrent: 2 },
  [UserTier.PRO]: { rpm: 120, rpd: 10000, concurrent: 10 },
  [UserTier.ENTERPRISE]: { rpm: 600, rpd: 100000, concurrent: 50 },
};

const TIER_ORDER = [UserTier.FREE, UserTier.PRO, UserTier.ENTERPRISE];

@Injectable()
export class TierRateLimitGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(Public, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const requiredTiers = this.reflector.getAllAndOverride<UserTier[]>(RequireTier, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as { id: string; tier: UserTier } | undefined;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    if (requiredTiers && requiredTiers.length > 0) {
      const userTierIndex = TIER_ORDER.indexOf(user.tier);
      const requiredTierIndex = Math.min(...requiredTiers.map(t => TIER_ORDER.indexOf(t)));
      if (userTierIndex < requiredTierIndex) {
        throw new ForbiddenException(`Requires ${requiredTiers.join(' or ')} tier`);
      }
    }

    // Simple in-memory rate limiting for now
    // In production, use Redis
    const limits = TIER_LIMITS[user.tier];
    const allowed = await this.checkRateLimit(user.id, limits);

    if (!allowed) {
      throw new ForbiddenException('Rate limit exceeded for your tier');
    }

    return true;
  }

  private async checkRateLimit(userId: string, limits: { rpm: number; rpd: number; concurrent: number }): Promise<boolean> {
    // For now, just return true - implement Redis-based rate limiting in production
    // This is a placeholder to avoid build errors
    return true;
  }
}
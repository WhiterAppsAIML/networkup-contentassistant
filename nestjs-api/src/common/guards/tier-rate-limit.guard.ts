import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService } from '../../redis/redis.service';
import { RequireTier, UserTier } from '../../common/decorators/require-tier.decorator';
import { Public } from '../../common/decorators/public.decorator';

interface AuthenticatedRequest {
  user: { id: string; tier: UserTier; firebaseUid: string; email: string } | undefined;
}

const TIER_LIMITS = {
  [UserTier.STARTER]: { rpm: 30, rpd: 1000, concurrent: 2 },
  [UserTier.GROWTH]: { rpm: 120, rpd: 10000, concurrent: 10 },
  [UserTier.ENTERPRISE]: { rpm: 600, rpd: 100000, concurrent: 50 },
};

const TIER_ORDER = [UserTier.STARTER, UserTier.GROWTH, UserTier.ENTERPRISE];

const RATE_LIMIT_SCRIPT = `
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local start = now - window

redis.call('ZREMRANGEBYSCORE', key, 0, start)
local count = redis.call('ZCARD', key)
if count >= limit then
  return 0
end
redis.call('ZADD', key, now, now .. '-' .. math.random())
redis.call('EXPIRE', key, window + 1)
return 1
`;

@Injectable()
export class TierRateLimitGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private redis: RedisService,
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

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

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

    const limits = TIER_LIMITS[user.tier];
    const allowed = await this.checkRateLimit(user.id, limits);

    if (!allowed) {
      throw new ForbiddenException('Rate limit exceeded for your tier');
    }

    return true;
  }

  private async checkRateLimit(userId: string, limits: { rpm: number; rpd: number; concurrent: number }): Promise<boolean> {
    const now = Date.now();
    const rpmKey = `ratelimit:rpm:${userId}`;
    const rpdKey = `ratelimit:rpd:${userId}`;

    const rpmAllowed = await this.redis.getClient().eval(
      RATE_LIMIT_SCRIPT,
      1,
      rpmKey,
      limits.rpm.toString(),
      '60000',
      now.toString(),
    );

    if (!rpmAllowed) {
      return false;
    }

    const rpdAllowed = await this.redis.getClient().eval(
      RATE_LIMIT_SCRIPT,
      1,
      rpdKey,
      limits.rpd.toString(),
      '86400000',
      now.toString(),
    );

    return !!rpdAllowed;
  }
}
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TierRateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const prisma_service_1 = require("../../prisma/prisma.service");
const require_tier_decorator_1 = require("../../common/decorators/require-tier.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const TIER_LIMITS = {
    [require_tier_decorator_1.UserTier.FREE]: { rpm: 30, rpd: 1000, concurrent: 2 },
    [require_tier_decorator_1.UserTier.PRO]: { rpm: 120, rpd: 10000, concurrent: 10 },
    [require_tier_decorator_1.UserTier.ENTERPRISE]: { rpm: 600, rpd: 100000, concurrent: 50 },
};
const TIER_ORDER = [require_tier_decorator_1.UserTier.FREE, require_tier_decorator_1.UserTier.PRO, require_tier_decorator_1.UserTier.ENTERPRISE];
let TierRateLimitGuard = class TierRateLimitGuard {
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.Public, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic)
            return true;
        const requiredTiers = this.reflector.getAllAndOverride(require_tier_decorator_1.RequireTier, [
            context.getHandler(),
            context.getClass(),
        ]);
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('Authentication required');
        }
        if (requiredTiers && requiredTiers.length > 0) {
            const userTierIndex = TIER_ORDER.indexOf(user.tier);
            const requiredTierIndex = Math.min(...requiredTiers.map(t => TIER_ORDER.indexOf(t)));
            if (userTierIndex < requiredTierIndex) {
                throw new common_1.ForbiddenException(`Requires ${requiredTiers.join(' or ')} tier`);
            }
        }
        const limits = TIER_LIMITS[user.tier];
        const allowed = await this.checkRateLimit(user.id, limits);
        if (!allowed) {
            throw new common_1.ForbiddenException('Rate limit exceeded for your tier');
        }
        return true;
    }
    async checkRateLimit(userId, limits) {
        return true;
    }
};
exports.TierRateLimitGuard = TierRateLimitGuard;
exports.TierRateLimitGuard = TierRateLimitGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService])
], TierRateLimitGuard);
//# sourceMappingURL=tier-rate-limit.guard.js.map
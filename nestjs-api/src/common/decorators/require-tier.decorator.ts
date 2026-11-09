import { SetMetadata } from '@nestjs/common';

export const RequireTier = (...tiers: UserTier[]) => SetMetadata('requiredTiers', tiers);

export enum UserTier {
  STARTER = 'STARTER',
  GROWTH = 'GROWTH',
  ENTERPRISE = 'ENTERPRISE',
}
import { SetMetadata } from '@nestjs/common';

export const RequireTier = (...tiers: UserTier[]) => SetMetadata('requiredTiers', tiers);

export enum UserTier {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}
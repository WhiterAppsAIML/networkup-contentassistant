export declare const RequireTier: (...tiers: UserTier[]) => import("@nestjs/common").CustomDecorator<string>;
export declare enum UserTier {
    FREE = "FREE",
    PRO = "PRO",
    ENTERPRISE = "ENTERPRISE"
}

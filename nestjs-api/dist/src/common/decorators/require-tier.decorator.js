"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTier = exports.RequireTier = void 0;
const common_1 = require("@nestjs/common");
const RequireTier = (...tiers) => (0, common_1.SetMetadata)('requiredTiers', tiers);
exports.RequireTier = RequireTier;
var UserTier;
(function (UserTier) {
    UserTier["FREE"] = "FREE";
    UserTier["PRO"] = "PRO";
    UserTier["ENTERPRISE"] = "ENTERPRISE";
})(UserTier || (exports.UserTier = UserTier = {}));
//# sourceMappingURL=require-tier.decorator.js.map
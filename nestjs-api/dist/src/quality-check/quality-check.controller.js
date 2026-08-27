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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QualityCheckController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const require_tier_decorator_1 = require("../common/decorators/require-tier.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const quality_check_service_1 = require("./quality-check.service");
let QualityCheckController = class QualityCheckController {
    constructor(qualityCheckService) {
        this.qualityCheckService = qualityCheckService;
    }
    async runQualityCheck(userId, id) {
        return this.qualityCheckService.checkContentQuality(id, userId);
    }
    async getQualityCheck(userId, id) {
        return this.qualityCheckService.getQualityCheck(id, userId);
    }
};
exports.QualityCheckController = QualityCheckController;
__decorate([
    (0, common_1.Post)(':id/quality-check'),
    (0, require_tier_decorator_1.RequireTier)(require_tier_decorator_1.UserTier.FREE),
    (0, swagger_1.ApiOperation)({ summary: 'Run quality check on generated content (Module 5)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], QualityCheckController.prototype, "runQualityCheck", null);
__decorate([
    (0, common_1.Get)(':id/quality-check'),
    (0, require_tier_decorator_1.RequireTier)(require_tier_decorator_1.UserTier.FREE),
    (0, swagger_1.ApiOperation)({ summary: 'Get quality check results' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], QualityCheckController.prototype, "getQualityCheck", null);
exports.QualityCheckController = QualityCheckController = __decorate([
    (0, swagger_1.ApiTags)('Quality Check (Module 5)'),
    (0, common_1.Controller)('content'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [quality_check_service_1.QualityCheckService])
], QualityCheckController);
//# sourceMappingURL=quality-check.controller.js.map
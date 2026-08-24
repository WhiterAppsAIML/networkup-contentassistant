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
exports.FrameworkController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const require_tier_decorator_1 = require("../common/decorators/require-tier.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const framework_service_1 = require("./framework.service");
const framework_dto_1 = require("./dto/framework.dto");
let FrameworkController = class FrameworkController {
    constructor(frameworkService) {
        this.frameworkService = frameworkService;
    }
    async create(userId, dto) {
        return this.frameworkService.create(userId, dto);
    }
    async list(userId, page = 1, limit = 20) {
        return this.frameworkService.list(userId, Number(page), Number(limit));
    }
    async get(userId, id) {
        return this.frameworkService.getById(id, userId);
    }
    async update(userId, id, dto) {
        return this.frameworkService.update(id, userId, dto);
    }
    async remove(userId, id) {
        return this.frameworkService.remove(id, userId);
    }
};
exports.FrameworkController = FrameworkController;
__decorate([
    (0, common_1.Post)(),
    (0, require_tier_decorator_1.RequireTier)(require_tier_decorator_1.UserTier.FREE),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new framework/template' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, framework_dto_1.CreateFrameworkDto]),
    __metadata("design:returntype", Promise)
], FrameworkController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, require_tier_decorator_1.RequireTier)(require_tier_decorator_1.UserTier.FREE),
    (0, swagger_1.ApiOperation)({ summary: 'List frameworks' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FrameworkController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_tier_decorator_1.RequireTier)(require_tier_decorator_1.UserTier.FREE),
    (0, swagger_1.ApiOperation)({ summary: 'Get framework by ID' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FrameworkController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, require_tier_decorator_1.RequireTier)(require_tier_decorator_1.UserTier.FREE),
    (0, swagger_1.ApiOperation)({ summary: 'Update framework' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, framework_dto_1.UpdateFrameworkDto]),
    __metadata("design:returntype", Promise)
], FrameworkController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_tier_decorator_1.RequireTier)(require_tier_decorator_1.UserTier.FREE),
    (0, swagger_1.ApiOperation)({ summary: 'Delete framework' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FrameworkController.prototype, "remove", null);
exports.FrameworkController = FrameworkController = __decorate([
    (0, swagger_1.ApiTags)('Frameworks (Templates)'),
    (0, common_1.Controller)('frameworks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [framework_service_1.FrameworkService])
], FrameworkController);
//# sourceMappingURL=framework.controller.js.map
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
exports.LibraryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const require_tier_decorator_1 = require("../common/decorators/require-tier.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const library_service_1 = require("./library.service");
const library_dto_1 = require("./dto/library.dto");
let LibraryController = class LibraryController {
    constructor(libraryService) {
        this.libraryService = libraryService;
    }
    async listContent(userId, query) {
        return this.libraryService.listContent(userId, query);
    }
    async archiveContent(userId, id) {
        return this.libraryService.archiveContent(id, userId);
    }
    async deleteContent(userId, id) {
        return this.libraryService.deleteContent(id, userId);
    }
    async listHooks(userId, query) {
        return this.libraryService.listHooks(userId, query);
    }
};
exports.LibraryController = LibraryController;
__decorate([
    (0, common_1.Get)('content'),
    (0, require_tier_decorator_1.RequireTier)(require_tier_decorator_1.UserTier.FREE),
    (0, swagger_1.ApiOperation)({ summary: 'List saved content drafts' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, library_dto_1.ContentListQueryDto]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "listContent", null);
__decorate([
    (0, common_1.Patch)('content/:id/archive'),
    (0, require_tier_decorator_1.RequireTier)(require_tier_decorator_1.UserTier.FREE),
    (0, swagger_1.ApiOperation)({ summary: 'Archive content' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "archiveContent", null);
__decorate([
    (0, common_1.Delete)('content/:id'),
    (0, require_tier_decorator_1.RequireTier)(require_tier_decorator_1.UserTier.FREE),
    (0, swagger_1.ApiOperation)({ summary: 'Delete content and hooks' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "deleteContent", null);
__decorate([
    (0, common_1.Get)('hooks'),
    (0, require_tier_decorator_1.RequireTier)(require_tier_decorator_1.UserTier.FREE),
    (0, swagger_1.ApiOperation)({ summary: 'List saved hooks' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, library_dto_1.HooksListQueryDto]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "listHooks", null);
exports.LibraryController = LibraryController = __decorate([
    (0, swagger_1.ApiTags)('Library'),
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [library_service_1.LibraryService])
], LibraryController);
//# sourceMappingURL=library.controller.js.map
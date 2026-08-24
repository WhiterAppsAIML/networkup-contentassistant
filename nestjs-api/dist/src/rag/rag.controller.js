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
exports.RagController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const require_tier_decorator_1 = require("../common/decorators/require-tier.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const rag_service_1 = require("./rag.service");
const rag_dto_1 = require("./dto/rag.dto");
let RagController = class RagController {
    constructor(ragService) {
        this.ragService = ragService;
    }
    async addDocument(userId, dto) {
        return this.ragService.addDocument(userId, dto);
    }
    async addDocumentsBatch(userId, dto) {
        return this.ragService.addDocumentsBatch(userId, dto);
    }
    async search(userId, dto) {
        return this.ragService.search(userId, dto);
    }
    async list(userId, query) {
        return this.ragService.list(userId, query);
    }
    async removeBySource(userId, sourceId) {
        return this.ragService.removeBySource(userId, sourceId);
    }
    async removeById(userId, id) {
        return this.ragService.removeById(userId, id);
    }
};
exports.RagController = RagController;
__decorate([
    (0, common_1.Post)(),
    (0, require_tier_decorator_1.RequireTier)(require_tier_decorator_1.UserTier.FREE),
    (0, swagger_1.ApiOperation)({ summary: 'Add a document to knowledge base (auto-chunked & embedded)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, rag_dto_1.AddDocumentDto]),
    __metadata("design:returntype", Promise)
], RagController.prototype, "addDocument", null);
__decorate([
    (0, common_1.Post)('batch'),
    (0, require_tier_decorator_1.RequireTier)(require_tier_decorator_1.UserTier.PRO),
    (0, swagger_1.ApiOperation)({ summary: 'Add multiple documents to knowledge base' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, rag_dto_1.AddDocumentsBatchDto]),
    __metadata("design:returntype", Promise)
], RagController.prototype, "addDocumentsBatch", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, require_tier_decorator_1.RequireTier)(require_tier_decorator_1.UserTier.FREE),
    (0, swagger_1.ApiOperation)({ summary: 'Search knowledge base with vector similarity' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, rag_dto_1.SearchRagDto]),
    __metadata("design:returntype", Promise)
], RagController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(),
    (0, require_tier_decorator_1.RequireTier)(require_tier_decorator_1.UserTier.FREE),
    (0, swagger_1.ApiOperation)({ summary: 'List ingested documents' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, rag_dto_1.RagListQueryDto]),
    __metadata("design:returntype", Promise)
], RagController.prototype, "list", null);
__decorate([
    (0, common_1.Delete)('source/:sourceId'),
    (0, require_tier_decorator_1.RequireTier)(require_tier_decorator_1.UserTier.FREE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete all chunks for a source' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('sourceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RagController.prototype, "removeBySource", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_tier_decorator_1.RequireTier)(require_tier_decorator_1.UserTier.FREE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete single document chunk' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RagController.prototype, "removeById", null);
exports.RagController = RagController = __decorate([
    (0, swagger_1.ApiTags)('RAG (Knowledge Base)'),
    (0, common_1.Controller)('rag'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [rag_service_1.RagService])
], RagController);
//# sourceMappingURL=rag.controller.js.map
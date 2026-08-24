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
exports.LibraryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LibraryService = class LibraryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listContent(userId, query) {
        const { status, page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;
        const where = { userId, ...(status ? { status } : {}) };
        const [items, total] = await Promise.all([
            this.prisma.content.findMany({
                where,
                orderBy: { updatedAt: 'desc' },
                skip,
                take: limit,
                include: { generated: true },
            }),
            this.prisma.content.count({ where }),
        ]);
        return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
    }
    async archiveContent(contentId, userId) {
        const content = await this.prisma.content.findFirst({ where: { id: BigInt(contentId), userId } });
        if (!content)
            throw new common_1.NotFoundException('Content not found');
        return this.prisma.content.update({
            where: { id: BigInt(contentId) },
            data: { status: 'ARCHIVED' },
        });
    }
    async deleteContent(contentId, userId) {
        const content = await this.prisma.content.findFirst({ where: { id: BigInt(contentId), userId } });
        if (!content)
            throw new common_1.NotFoundException('Content not found');
        await this.prisma.$transaction([
            this.prisma.hook.deleteMany({ where: { contentId: BigInt(contentId) } }),
            this.prisma.content.delete({ where: { id: BigInt(contentId) } }),
        ]);
        return { message: 'Content deleted' };
    }
    async listHooks(userId, query) {
        const { category, page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;
        const where = { userId, ...(category ? { category } : {}) };
        const [items, total] = await Promise.all([
            this.prisma.hook.findMany({
                where,
                orderBy: [{ timesUsed: 'desc' }, { createdAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.hook.count({ where }),
        ]);
        return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
    }
};
exports.LibraryService = LibraryService;
exports.LibraryService = LibraryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LibraryService);
//# sourceMappingURL=library.service.js.map
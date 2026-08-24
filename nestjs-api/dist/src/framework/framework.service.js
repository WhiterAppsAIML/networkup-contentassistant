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
exports.FrameworkService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FrameworkService = class FrameworkService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        return this.prisma.framework.create({
            data: { userId, name: dto.name, structure: dto.structure, description: dto.description },
        });
    }
    async list(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.prisma.framework.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
            this.prisma.framework.count({ where: { userId } }),
        ]);
        return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
    }
    async getById(id, userId) {
        const framework = await this.prisma.framework.findFirst({ where: { id: BigInt(id), userId } });
        if (!framework)
            throw new common_1.NotFoundException('Framework not found');
        return framework;
    }
    async update(id, userId, dto) {
        const framework = await this.prisma.framework.findFirst({ where: { id: BigInt(id), userId } });
        if (!framework)
            throw new common_1.NotFoundException('Framework not found');
        return this.prisma.framework.update({
            where: { id: BigInt(id) },
            data: { name: dto.name, structure: dto.structure, description: dto.description },
        });
    }
    async remove(id, userId) {
        const framework = await this.prisma.framework.findFirst({ where: { id: BigInt(id), userId } });
        if (!framework)
            throw new common_1.NotFoundException('Framework not found');
        await this.prisma.framework.delete({ where: { id: BigInt(id) } });
        return { message: 'Framework deleted' };
    }
};
exports.FrameworkService = FrameworkService;
exports.FrameworkService = FrameworkService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FrameworkService);
//# sourceMappingURL=framework.service.js.map
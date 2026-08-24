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
exports.CtaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CtaService = class CtaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        return this.prisma.cTA.create({ data: { userId, text: dto.text, type: dto.type } });
    }
    async list(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.prisma.cTA.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
            this.prisma.cTA.count({ where: { userId } }),
        ]);
        return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
    }
    async getById(id, userId) {
        const cta = await this.prisma.cTA.findFirst({ where: { id: BigInt(id), userId } });
        if (!cta)
            throw new common_1.NotFoundException('CTA not found');
        return cta;
    }
    async update(id, userId, dto) {
        const cta = await this.prisma.cTA.findFirst({ where: { id: BigInt(id), userId } });
        if (!cta)
            throw new common_1.NotFoundException('CTA not found');
        return this.prisma.cTA.update({
            where: { id: BigInt(id) },
            data: { text: dto.text, type: dto.type },
        });
    }
    async remove(id, userId) {
        const cta = await this.prisma.cTA.findFirst({ where: { id: BigInt(id), userId } });
        if (!cta)
            throw new common_1.NotFoundException('CTA not found');
        await this.prisma.cTA.delete({ where: { id: BigInt(id) } });
        return { message: 'CTA deleted' };
    }
};
exports.CtaService = CtaService;
exports.CtaService = CtaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CtaService);
//# sourceMappingURL=cta.service.js.map
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
var QdrantService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QdrantService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const qdrant_js_1 = require("@qdrant/qdrant-js");
const COLLECTION_NAME = 'rag_documents';
const VECTOR_SIZE = 768;
let QdrantService = QdrantService_1 = class QdrantService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(QdrantService_1.name);
        const url = this.configService.get('QDRANT_URL') || 'http://localhost:6333';
        const apiKey = this.configService.get('QDRANT_API_KEY');
        this.client = new qdrant_js_1.QdrantClient({ url, apiKey });
    }
    async onModuleInit() {
        await this.ensureCollection();
    }
    async ensureCollection() {
        try {
            const collections = await this.client.getCollections();
            const exists = collections.collections.some(c => c.name === COLLECTION_NAME);
            if (!exists) {
                await this.client.createCollection(COLLECTION_NAME, {
                    vectors: { size: VECTOR_SIZE, distance: 'Cosine' },
                });
                await this.client.createPayloadIndex(COLLECTION_NAME, {
                    field_name: 'userId',
                    field_schema: 'keyword',
                });
                await this.client.createPayloadIndex(COLLECTION_NAME, {
                    field_name: 'sourceId',
                    field_schema: 'keyword',
                });
                await this.client.createPayloadIndex(COLLECTION_NAME, {
                    field_name: 'sourceType',
                    field_schema: 'keyword',
                });
                this.logger.log(`Created Qdrant collection: ${COLLECTION_NAME}`);
            }
        }
        catch (error) {
            const err = error;
            this.logger.error('Failed to ensure Qdrant collection:', err.message);
        }
    }
    async upsert(points) {
        await this.client.upsert(COLLECTION_NAME, { wait: true, points });
    }
    async search(options) {
        const { vector, filter, limit = 5, offset = 0 } = options;
        const result = await this.client.query(COLLECTION_NAME, {
            query: vector,
            filter: filter ? this.buildFilter(filter) : undefined,
            limit,
            offset,
            with_payload: true,
        });
        return result.points.map((p) => ({ id: p.id, score: p.score, payload: p.payload }));
    }
    async delete(filter) {
        await this.client.delete(COLLECTION_NAME, { filter: this.buildFilter(filter) });
    }
    async deleteByIds(ids) {
        await this.client.delete(COLLECTION_NAME, { points: ids });
    }
    buildFilter(filter) {
        const must = Object.entries(filter).map(([key, value]) => ({
            key,
            match: { value },
        }));
        return { must };
    }
};
exports.QdrantService = QdrantService;
exports.QdrantService = QdrantService = QdrantService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], QdrantService);
//# sourceMappingURL=qdrant.service.js.map
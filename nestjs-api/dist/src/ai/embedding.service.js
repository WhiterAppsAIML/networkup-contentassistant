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
var EmbeddingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const genai_1 = require("@google/genai");
const EMBEDDING_MODEL = 'text-embedding-004';
const EMBEDDING_DIMENSIONS = 768;
const BATCH_SIZE = 20;
let EmbeddingService = EmbeddingService_1 = class EmbeddingService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(EmbeddingService_1.name);
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY not configured for embeddings');
        }
        this.client = new genai_1.GoogleGenAI({ apiKey });
    }
    async embed(text) {
        try {
            const result = await this.client.models.embedContent({
                model: EMBEDDING_MODEL,
                contents: text,
                config: { outputDimensionality: EMBEDDING_DIMENSIONS },
            });
            return result.embeddings?.[0]?.values || [];
        }
        catch (error) {
            const err = error;
            this.logger.error('Embedding generation failed:', err.message);
            throw new Error(`Failed to generate embedding: ${err.message}`);
        }
    }
    async embedBatch(texts) {
        const results = [];
        for (let i = 0; i < texts.length; i += BATCH_SIZE) {
            const batch = texts.slice(i, i + BATCH_SIZE);
            const batchResults = await Promise.all(batch.map(t => this.embed(t)));
            results.push(...batchResults);
        }
        return results;
    }
};
exports.EmbeddingService = EmbeddingService;
exports.EmbeddingService = EmbeddingService = EmbeddingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmbeddingService);
//# sourceMappingURL=embedding.service.js.map
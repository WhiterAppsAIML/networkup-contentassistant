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
var GeminiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const genai_1 = require("@google/genai");
let GeminiService = GeminiService_1 = class GeminiService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(GeminiService_1.name);
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY not configured');
        }
        this.client = new genai_1.GoogleGenAI({ apiKey });
        this.model = this.configService.get('GEMINI_MODEL') || 'gemini-3.7-flash';
    }
    async generateJSON(options) {
        const { system, prompt, schema, maxTokens = 1500, retries = 2 } = options;
        let lastRaw = '';
        for (let attempt = 0; attempt <= retries; attempt++) {
            const currentPrompt = attempt === 0
                ? prompt
                : `${prompt}\n\nYour previous response could not be parsed as valid JSON. Respond again with ONLY valid JSON, no markdown fences, no preamble, no explanation.\n\nPrevious response:\n${lastRaw}`;
            try {
                const interaction = await this.client.interactions.create({
                    model: this.model,
                    input: currentPrompt,
                    system_instruction: system,
                    generation_config: {
                        max_output_tokens: maxTokens,
                        thinking_level: 'low',
                        ...(schema ? {
                            response_format: {
                                type: 'text',
                                mime_type: 'application/json',
                                schema,
                            },
                        } : {}),
                    },
                });
                const raw = interaction.output_text || '';
                lastRaw = raw;
                const parsed = this.safeParseJSON(raw);
                if (parsed)
                    return parsed;
                this.logger.warn(`AI JSON parse failed on attempt ${attempt + 1}/${retries + 1}`);
            }
            catch (error) {
                const err = error;
                this.logger.error(`AI call failed on attempt ${attempt + 1}:`, err.message);
                if (attempt === retries) {
                    throw new Error(`AI generation failed after ${retries + 1} attempts: ${err.message}`);
                }
            }
        }
        throw new Error('AI returned an unparseable response after retries');
    }
    async generateText(options) {
        const { system, prompt, maxTokens = 1500 } = options;
        const interaction = await this.client.interactions.create({
            model: this.model,
            input: prompt,
            system_instruction: system,
            generation_config: {
                max_output_tokens: maxTokens,
                thinking_level: 'low',
            },
        });
        return interaction.output_text || '';
    }
    safeParseJSON(raw) {
        try {
            const cleaned = raw.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
            return JSON.parse(cleaned);
        }
        catch {
            return null;
        }
    }
};
exports.GeminiService = GeminiService;
exports.GeminiService = GeminiService = GeminiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeminiService);
//# sourceMappingURL=gemini.service.js.map
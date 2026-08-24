"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptBuilderService = void 0;
const common_1 = require("@nestjs/common");
let PromptBuilderService = class PromptBuilderService {
    buildAnglePrompt(input) {
        const system = `You are an expert LinkedIn content strategist. Generate 5 distinct angles for a post based on the user's input. Each angle must have a unique perspective type: mistake, surprise, framework, contrarian, lessons. Return valid JSON only.`;
        const prompt = `Generate 5 angles for a LinkedIn post:

Content Goal: ${input.contentGoal}
Post Type: ${input.postType}
Topic: ${input.topic}
Audience: ${input.audience}
Experience Notes: ${input.experienceNotes}
Tone: ${input.tone}

Return exactly 5 angles with types: mistake, surprise, framework, contrarian, lessons.`;
        const schema = {
            type: 'object',
            properties: {
                angles: {
                    type: 'array',
                    minItems: 5,
                    maxItems: 5,
                    items: {
                        type: 'object',
                        properties: {
                            type: { type: 'string', enum: ['mistake', 'surprise', 'framework', 'contrarian', 'lessons'] },
                            label: { type: 'string' },
                            text: { type: 'string' },
                        },
                        required: ['type', 'label', 'text'],
                    },
                },
            },
            required: ['angles'],
        };
        return { system, prompt, schema };
    }
    buildHookPrompt(input) {
        const system = `You are an expert LinkedIn hook writer. Generate exactly 4 hooks, one for each category: curiosity, contrarian, story, question. Return valid JSON only.`;
        const prompt = `Generate 4 hooks for a LinkedIn post based on this angle:

Angle: ${input.selectedAngleText}
Experience Notes: ${input.experienceNotes}
Tone: ${input.tone}
Topic: ${input.topic}

Return exactly 4 hooks, one per category: curiosity, contrarian, story, question.`;
        const schema = {
            type: 'object',
            properties: {
                hooks: {
                    type: 'array',
                    minItems: 4,
                    maxItems: 4,
                    items: {
                        type: 'object',
                        properties: {
                            category: { type: 'string', enum: ['curiosity', 'contrarian', 'story', 'question'] },
                            text: { type: 'string' },
                        },
                        required: ['category', 'text'],
                    },
                },
            },
            required: ['hooks'],
        };
        return { system, prompt, schema };
    }
    buildContentPrompt(input) {
        const system = `You are an expert LinkedIn post writer. Generate a complete post following the hook-problem-experience-insight-takeaway-CTA structure. Return valid JSON only.`;
        const prompt = `Write a LinkedIn post:

Hook: ${input.selectedHookText}
Angle: ${input.selectedAngleText}
Experience Notes: ${input.experienceNotes}
Topic: ${input.topic}
Audience: ${input.audience}
Tone: ${input.tone}
Post Type: ${input.postType}
CTA: ${input.cta}`;
        const schema = {
            type: 'object',
            properties: {
                hook: { type: 'string' },
                problem: { type: 'string' },
                experience: { type: 'string' },
                insight: { type: 'string' },
                takeaway: { type: 'string' },
                cta: { type: 'string' },
                fullText: { type: 'string' },
            },
            required: ['hook', 'problem', 'experience', 'insight', 'takeaway', 'cta', 'fullText'],
        };
        return { system, prompt, schema };
    }
    buildImprovePrompt(input) {
        const system = `You are an expert LinkedIn content editor. Apply the requested improvement action to the current content. Return the full revised content as valid JSON only.`;
        const prompt = `Improve this LinkedIn post:

Current Content:
Hook: ${input.currentContent.hook}
Problem: ${input.currentContent.problem}
Experience: ${input.currentContent.experience}
Insight: ${input.currentContent.insight}
Takeaway: ${input.currentContent.takeaway}
CTA: ${input.currentContent.cta}
Full Text: ${input.currentContent.fullText}

Action: ${input.action}
Experience Notes: ${input.experienceNotes}
Tone: ${input.tone}
Audience: ${input.audience}`;
        const schema = {
            type: 'object',
            properties: {
                hook: { type: 'string' },
                problem: { type: 'string' },
                experience: { type: 'string' },
                insight: { type: 'string' },
                takeaway: { type: 'string' },
                cta: { type: 'string' },
                fullText: { type: 'string' },
            },
            required: ['hook', 'problem', 'experience', 'insight', 'takeaway', 'cta', 'fullText'],
        };
        return { system, prompt, schema };
    }
    buildLeadMagnetPrompt(input) {
        const system = `You are an expert lead magnet creator. Generate a complete lead magnet package including title, outline, landing page copy, email sequence, LinkedIn promo post, and CTA. Return valid JSON only.`;
        const prompt = `Create a lead magnet:

Audience: ${input.audience}
Problem: ${input.problem}
Outcome: ${input.outcome}
Asset Type: ${input.assetType}
CTA Goal: ${input.ctaGoal}
Topic: ${input.topic}`;
        const schema = {
            type: 'object',
            properties: {
                title: { type: 'string' },
                outline: { type: 'array', items: { type: 'string' } },
                landingPageCopy: { type: 'string' },
                emailSequence: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            subject: { type: 'string' },
                            body: { type: 'string' },
                        },
                        required: ['subject', 'body'],
                    },
                },
                linkedinPromotionPost: { type: 'string' },
                cta: { type: 'string' },
            },
            required: ['title', 'outline', 'landingPageCopy', 'emailSequence', 'linkedinPromotionPost', 'cta'],
        };
        return { system, prompt, schema };
    }
};
exports.PromptBuilderService = PromptBuilderService;
exports.PromptBuilderService = PromptBuilderService = __decorate([
    (0, common_1.Injectable)()
], PromptBuilderService);
//# sourceMappingURL=prompt-builder.service.js.map
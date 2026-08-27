export interface QualityCheckPromptInput {
    generatedContent: {
        hook: string;
        problem: string;
        experience: string;
        insight: string;
        takeaway: string;
        cta: string;
        fullText: string;
    };
    experienceNotes: string;
    audience: string;
    tone: string;
}
export declare class QualityCheckPromptService {
    buildQualityCheckPrompt(input: QualityCheckPromptInput): {
        system: string;
        prompt: string;
        schema: any;
    };
    getQualityDimensions(): string[];
    calculateOverall(scores: Record<string, {
        score: number;
        issue: string;
    }>): number;
    getWeakDimensions(scores: Record<string, {
        score: number;
        issue: string;
    }>, threshold?: number): string[];
    validateScores(scores: Record<string, {
        score: number;
        issue: string;
    }>): void;
}

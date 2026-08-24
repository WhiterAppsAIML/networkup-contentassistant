export interface AnglePromptInput {
    contentGoal: string;
    postType: string;
    topic: string;
    audience: string;
    experienceNotes: string;
    tone: string;
}
export interface HookPromptInput {
    selectedAngleText: string;
    experienceNotes: string;
    tone: string;
    topic: string;
}
export interface ContentPromptInput {
    selectedHookText: string;
    selectedAngleText: string;
    experienceNotes: string;
    topic: string;
    audience: string;
    tone: string;
    postType: string;
    cta: string;
}
export interface ImprovePromptInput {
    action: string;
    currentContent: {
        hook: string;
        problem: string;
        experience: string;
        insight: string;
        takeaway: string;
        cta: string;
        fullText: string;
    };
    experienceNotes: string;
    tone: string;
    audience: string;
}
export interface LeadMagnetPromptInput {
    audience: string;
    problem: string;
    outcome: string;
    assetType: string;
    ctaGoal: string;
    topic: string;
}
export declare class PromptBuilderService {
    buildAnglePrompt(input: AnglePromptInput): {
        system: string;
        prompt: string;
        schema: any;
    };
    buildHookPrompt(input: HookPromptInput): {
        system: string;
        prompt: string;
        schema: any;
    };
    buildContentPrompt(input: ContentPromptInput): {
        system: string;
        prompt: string;
        schema: any;
    };
    buildImprovePrompt(input: ImprovePromptInput): {
        system: string;
        prompt: string;
        schema: any;
    };
    buildLeadMagnetPrompt(input: LeadMagnetPromptInput): {
        system: string;
        prompt: string;
        schema: any;
    };
}

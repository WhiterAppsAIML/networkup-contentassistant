export declare class QualityCheckResponseDto {
    scores: Record<string, {
        score: number;
        issue: string;
    }>;
    overall: number;
    weakDimensions: string[];
    needsImprovement: boolean;
}

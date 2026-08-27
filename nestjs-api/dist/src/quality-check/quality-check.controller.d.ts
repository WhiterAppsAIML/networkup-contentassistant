import { QualityCheckService } from './quality-check.service';
export declare class QualityCheckController {
    private qualityCheckService;
    constructor(qualityCheckService: QualityCheckService);
    runQualityCheck(userId: string, id: string): Promise<{
        scores: Record<string, {
            score: number;
            issue: string;
        }>;
        overall: number;
        weakDimensions: string[];
        needsImprovement: boolean;
    }>;
    getQualityCheck(userId: string, id: string): Promise<{
        scores: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        overall: number | null;
        weakDimensions: string[];
        needsImprovement: boolean;
        checkedAt: Date | null;
    }>;
}

import { ConfigService } from '@nestjs/config';
export interface GenerateOptions {
    system: string;
    prompt: string;
    schema?: any;
    maxTokens?: number;
    temperature?: number;
    retries?: number;
}
export declare class GeminiService {
    private configService;
    private readonly logger;
    private readonly client;
    private readonly model;
    constructor(configService: ConfigService);
    generateJSON<T>(options: GenerateOptions): Promise<T>;
    generateText(options: GenerateOptions): Promise<string>;
    private safeParseJSON;
}

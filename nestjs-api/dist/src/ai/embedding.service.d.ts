import { ConfigService } from '@nestjs/config';
export declare class EmbeddingService {
    private configService;
    private readonly logger;
    private readonly client;
    constructor(configService: ConfigService);
    embed(text: string): Promise<number[]>;
    embedBatch(texts: string[]): Promise<number[][]>;
}

import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiService } from './gemini.service';
import { EmbeddingService } from './embedding.service';
import { PromptBuilderService } from './prompt-builder.service';
import { QualityCheckPromptService } from './quality-check-prompt.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [GeminiService, EmbeddingService, PromptBuilderService, QualityCheckPromptService],
  exports: [GeminiService, EmbeddingService, PromptBuilderService, QualityCheckPromptService],
})
export class AiModule {}
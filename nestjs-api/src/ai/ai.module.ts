import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiService } from './gemini.service';
import { EmbeddingService } from './embedding.service';
import { PromptBuilderService } from './prompt-builder.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [GeminiService, EmbeddingService, PromptBuilderService],
  exports: [GeminiService, EmbeddingService, PromptBuilderService],
})
export class AiModule {}
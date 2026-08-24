import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

export interface GenerateOptions {
  system: string;
  prompt: string;
  schema?: any;
  maxTokens?: number;
  temperature?: number;
  retries?: number;
}

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly client: GoogleGenAI;
  private readonly model: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }
    this.client = new GoogleGenAI({ apiKey });
    this.model = this.configService.get<string>('GEMINI_MODEL') || 'gemini-3.7-flash';
  }

  async generateJSON<T>(options: GenerateOptions): Promise<T> {
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

        const parsed = this.safeParseJSON<T>(raw);
        if (parsed) return parsed;

        this.logger.warn(`AI JSON parse failed on attempt ${attempt + 1}/${retries + 1}`);
      } catch (error) {
        const err = error as Error;
        this.logger.error(`AI call failed on attempt ${attempt + 1}:`, err.message);
        if (attempt === retries) {
          throw new Error(`AI generation failed after ${retries + 1} attempts: ${err.message}`);
        }
      }
    }

    throw new Error('AI returned an unparseable response after retries');
  }

  async generateText(options: GenerateOptions): Promise<string> {
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

  private safeParseJSON<T>(raw: string): T | null {
    try {
      const cleaned = raw.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  }
}
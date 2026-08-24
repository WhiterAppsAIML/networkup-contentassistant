import { IsString, IsEnum, IsOptional, IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ContentStatus } from '@prisma/client';

export class CreateContentDto {
  @IsString() contentGoal: string;
  @IsString() postType: string;
  @IsString() topic: string;
  @IsString() audience: string;
  @IsString() experienceNotes: string;
  @IsString() tone: string;
  @IsString() cta: string;
}

export class SelectAngleDto {
  @IsString() angleId: string;
}

export class SelectHookDto {
  @IsString() hookId: string;
}

export class ImproveContentDto {
  @IsString() action: string;
}

export class ContentQueryDto {
  @IsOptional() @IsEnum(ContentStatus) status?: ContentStatus;
  @IsOptional() page?: number = 1;
  @IsOptional() limit?: number = 20;
}

export class AngleResponseDto {
  id: string;
  type: string;
  label: string;
  text: string;
  sortOrder: number;
}

export class HookResponseDto {
  id: string;
  category: string;
  text: string;
}

export class GeneratedContentDto {
  hook: string;
  problem: string;
  experience: string;
  insight: string;
  takeaway: string;
  cta: string;
  fullText: string;
}
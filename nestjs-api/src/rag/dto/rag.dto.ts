import { IsString, IsOptional, IsNumber, IsEnum, Min, Max, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AddDocumentDto {
  @IsString() sourceId: string;
  @IsString() sourceType: string;
  @IsString() title: string;
  @IsString() content: string;
  @IsOptional() metadata?: Record<string, any>;
  @IsOptional() @IsNumber() chunkIndex?: number = 0;
}

export class AddDocumentsBatchDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddDocumentDto)
  documents: AddDocumentDto[];
}

export class SearchRagDto {
  @IsString() query: string;
  @IsOptional() @IsNumber() @Min(1) @Max(20) topK?: number = 5;
  @IsOptional() @IsString() sourceId?: string;
  @IsOptional() @IsNumber() @Min(0) @Max(1) minScore?: number = 0.7;
}

export class RagListQueryDto {
  @IsOptional() page?: number = 1;
  @IsOptional() limit?: number = 20;
  @IsOptional() @IsString() sourceId?: string;
}
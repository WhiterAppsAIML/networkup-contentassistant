import { IsOptional, IsEnum, IsString } from 'class-validator';

export enum ContentStatusEnum {
  DRAFT = 'DRAFT',
  ANGLES_GENERATED = 'ANGLES_GENERATED',
  HOOKS_GENERATED = 'HOOKS_GENERATED',
  HOOK_SELECTED = 'HOOK_SELECTED',
  CONTENT_GENERATED = 'CONTENT_GENERATED',
  IMPROVED = 'IMPROVED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum HookCategoryEnum {
  CURIOSITY = 'CURIOSITY',
  CONTRARIAN = 'CONTRARIAN',
  STORY = 'STORY',
  QUESTION = 'QUESTION',
}

export class ContentListQueryDto {
  @IsOptional() @IsEnum(ContentStatusEnum) status?: ContentStatusEnum;
  @IsOptional() page?: number = 1;
  @IsOptional() limit?: number = 20;
}

export class HooksListQueryDto {
  @IsOptional() @IsEnum(HookCategoryEnum) category?: HookCategoryEnum;
  @IsOptional() page?: number = 1;
  @IsOptional() limit?: number = 20;
}
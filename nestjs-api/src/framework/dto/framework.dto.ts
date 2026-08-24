import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateFrameworkDto {
  @IsString() name: string;
  @IsArray() @IsString({ each: true }) structure: string[];
  @IsOptional() @IsString() description?: string;
}

export class UpdateFrameworkDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) structure?: string[];
  @IsOptional() @IsString() description?: string;
}
import { IsString, IsOptional } from 'class-validator';

export class CreateLeadMagnetDto {
  @IsString() audience: string;
  @IsString() problem: string;
  @IsString() outcome: string;
  @IsString() assetType: string;
  @IsString() ctaGoal: string;
  @IsString() topic: string;
}

export class LeadMagnetQueryDto {
  @IsOptional() page?: number = 1;
  @IsOptional() limit?: number = 20;
}
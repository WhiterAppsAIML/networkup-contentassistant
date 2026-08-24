import { IsString, IsISO8601, IsOptional, IsDateString } from 'class-validator';

export class CreateScheduleDto {
  @IsString() contentId: string;
  @IsISO8601() scheduledFor: string;
}

export class ScheduleQueryDto {
  @IsOptional() @IsISO8601() startDate?: string;
  @IsOptional() @IsISO8601() endDate?: string;
  @IsOptional() page?: number = 1;
  @IsOptional() limit?: number = 20;
}
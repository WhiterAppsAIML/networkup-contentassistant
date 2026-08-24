import { IsString, IsOptional } from 'class-validator';

export class CreateCtaDto {
  @IsString() text: string;
  @IsOptional() @IsString() type?: string = 'custom';
}

export class UpdateCtaDto {
  @IsOptional() @IsString() text?: string;
  @IsOptional() @IsString() type?: string;
}
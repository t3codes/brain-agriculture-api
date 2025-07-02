import { IsOptional, IsString, IsNumber, IsInt, IsDateString } from 'class-validator';

export class UpdateCropDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  variety?: string;

  @IsOptional()
  @IsInt()
  harvestYear?: number;

  @IsOptional()
  @IsDateString()
  plantingDate?: string;

  @IsOptional()
  @IsDateString()
  harvestDate?: string;

  @IsOptional()
  @IsNumber()
  yield?: number;

  @IsOptional()
  @IsNumber()
  area?: number;

  @IsOptional()
  @IsInt()
  farmId?: number;
}

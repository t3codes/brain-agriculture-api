// DTOs - create-crop.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class CreateCropDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  variety?: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  harvestYear: number;

  @IsOptional()
  @IsDateString()
  plantingDate?: string;

  @IsOptional()
  @IsDateString()
  harvestDate?: string;

  @IsOptional()
  @IsNumber()
  yield?: number;

  @IsNumber()
  area: number;

  @IsInt()
  farmId: number;
}

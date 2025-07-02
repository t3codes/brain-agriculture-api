import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, IsOptional, IsArray, ValidateNested } from 'class-validator';



export class UpdateFarmDto {
  @ApiProperty({ example: 'Fazenda Feliz Atualizada', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Campinas', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'SP', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ example: 1100.5, required: false })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  totalArea?: number;

  @ApiProperty({ example: 750.25, required: false })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  arableArea?: number;

  @ApiProperty({ example: 350.25, required: false })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  vegetationArea?: number;
}
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsPositive, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


export class CreateFarmDto {
  @ApiProperty({ example: 'Fazenda Feliz' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'São Paulo' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'SP' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: 1000.5 })
  @IsNumber()
  @IsPositive()
  totalArea: number;

  @ApiProperty({ example: 700.25 })
  @IsNumber()
  @IsPositive()
  arableArea: number;

  @ApiProperty({ example: 300.25 })
  @IsNumber()
  @IsPositive()
  vegetationArea: number;

  @ApiProperty({ description: 'ID do produtor responsável pela fazenda' })
  @IsNumber()
  @IsPositive()
  producerId: number;
}
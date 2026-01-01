import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsArray, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MultilingualTextDto, CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  // All fields are already optional due to PartialType(CreateProductDto)
  // If you need to override any validation rules or add new ones specific to update, do it here.
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MultilingualTextDto)
  highlights?: MultilingualTextDto[];

  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => MultilingualTextDto)
  specifications?: Record<string, MultilingualTextDto>;
}

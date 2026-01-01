import { IsString, IsNumber, IsOptional, IsArray, IsBoolean, IsUrl, Min, Max, Length, IsEnum, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MultilingualTextDto {
  @IsString()
  en: string;

  @IsOptional()
  @IsString()
  ar?: string;

  @IsOptional()
  @IsString()
  fr?: string;
}

export class CreateProductDto {
  @ValidateNested()
  @Type(() => MultilingualTextDto)
  name: MultilingualTextDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MultilingualTextDto)
  tagline?: MultilingualTextDto;

  @IsNumber()
  @Min(0)
  @Max(100000)
  price: number;

  @ValidateNested()
  @Type(() => MultilingualTextDto)
  description: MultilingualTextDto;

  @IsString()
  @IsEnum(['mattress', 'furniture'])
  category: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  model3d?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MultilingualTextDto)
  highlights?: MultilingualTextDto[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  reviewsCount?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => MultilingualTextDto)
  shippingInfo?: MultilingualTextDto;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  warrantyYears?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => MultilingualTextDto)
  specifications?: Record<string, MultilingualTextDto>;

  @IsOptional()
  @IsBoolean()
  inStock?: boolean;
}

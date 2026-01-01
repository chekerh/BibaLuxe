import { IsString, IsOptional, IsArray, IsBoolean, ValidateNested, Length } from 'class-validator';
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

export class CreateAiChatDto {
  @IsString()
  @Length(1, 500)
  question: string;

  @ValidateNested()
  @Type(() => MultilingualTextDto)
  answer: MultilingualTextDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}


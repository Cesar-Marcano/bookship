import {
  IsOptional,
  IsString,
  IsUrl,
  IsEnum,
  IsNotEmpty,
  IsNumber,
} from "class-validator";
import { IsSlug } from "../../utils/slugDecorator";
import { Genre } from "./createBook.dto";

export class UpdateBookDto {
  @IsNumber()
  id!: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsSlug()
  @IsString()
  @IsNotEmpty()
  slug?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  author?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsEnum(Genre)
  genre?: Genre;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  publication_year?: string;

  @IsOptional()
  @IsUrl()
  cover_image_url?: string;

  @IsOptional()
  @IsUrl()
  file_url?: string;
}

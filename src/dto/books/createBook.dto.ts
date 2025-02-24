import { IsOptional, IsString, IsUrl, IsNotEmpty } from "class-validator";
import { IsSlug } from "../../utils/slugDecorator";

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsSlug()
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  author!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  genre!: string;

  @IsString()
  @IsNotEmpty()
  publication_year!: string;

  @IsOptional()
  @IsUrl()
  cover_image_url?: string;

  @IsOptional()
  @IsUrl()
  file_url?: string;
}

import {
  IsOptional,
  IsString,
  IsUrl,
  IsNotEmpty,
  IsNumber,
} from "class-validator";
import { IsSlug } from "../../utils/slugDecorator";

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateBookDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         title:
 *           type: string
 *           example: "The Great Gatsby"
 *         slug:
 *           type: string
 *           example: "the-great-gatsby"
 *         author:
 *           type: string
 *           example: "F. Scott Fitzgerald"
 *         description:
 *           type: string
 *           example: "A novel about the American dream."
 *         genre:
 *           type: string
 *           example: "Fiction"
 *         publication_year:
 *           type: string
 *           example: "1925"
 *         cover_image_url:
 *           type: string
 *           format: uri
 *           example: "https://example.com/cover.jpg"
 *         file_url:
 *           type: string
 *           format: uri
 *           example: "https://example.com/book.pdf"
 */
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
  @IsString()
  @IsNotEmpty()
  genre?: string;

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

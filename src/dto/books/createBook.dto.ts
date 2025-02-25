import { IsOptional, IsString, IsUrl, IsNotEmpty } from "class-validator";
import { IsSlug } from "../../utils/slugDecorator";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateBookDto:
 *       type: object
 *       required:
 *         - title
 *         - slug
 *         - author
 *         - description
 *         - genre
 *         - publication_year
 *       properties:
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

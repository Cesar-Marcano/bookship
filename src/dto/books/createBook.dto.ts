import {
  IsOptional,
  IsString,
  IsUrl,
  IsEnum,
  IsNotEmpty,
} from "class-validator";
import { IsSlug } from "../../utils/slugDecorator";

export enum Genre {
  Academic = "Academic",
  Fiction = "Fiction",
  NonFiction = "Non-Fiction",
  ScienceFiction = "Science Fiction",
  Fantasy = "Fantasy",
  Poetry = "Poetry",
  HistoricalFiction = "Historical Fiction",
  Thriller = "Thriller",
  Romance = "Romance",
  Mystery = "Mystery",
  Horror = "Horror",
  Comedy = "Comedy",
  Drama = "Drama",
  Adventure = "Adventure",
  Biography = "Biography",
  SelfHelp = "Self-Help",
  Motivational = "Motivational",
  PersonalDevelopment = "Personal Development",
  HealthAndWellness = "Health and Wellness",
  Cooking = "Cooking",
  Travel = "Travel",
  Business = "Business",
  Economics = "Economics",
  Politics = "Politics",
  Religion = "Religion",
  Philosophy = "Philosophy",
  History = "History",
  Coding = "Coding",
  Programming = "Programming",
  YoungAdult = "Young Adult",
  GraphicNovel = "Graphic Novel",
  Dystopian = "Dystopian",
  Classic = "Classic",
  Memoir = "Memoir",
  TrueCrime = "True Crime",
  Anthology = "Anthology",
  ShortStories = "Short Stories",
  ChildrensLiterature = "Children's Literature",
  Economy = "Economy",
  Psychology = "Psychology",
}

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
  
  @IsEnum(Genre)
  genre!: Genre;
  
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

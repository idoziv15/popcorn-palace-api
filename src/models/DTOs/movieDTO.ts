import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsNumber()
  @Min(1)
  duration: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  releaseYear: number;
}

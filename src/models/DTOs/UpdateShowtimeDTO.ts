import { IsOptional, IsNumber, IsString, IsDateString } from 'class-validator';

export class UpdateShowtimeDto {
  @IsOptional()
  @IsNumber()
  movieId?: number;

  @IsOptional()
  @IsString()
  theater?: string;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsNumber()
  price?: number;
}
import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateShowtimeDto {
  @IsNumber()
  @IsNotEmpty()
  movieId: number;

  @IsNotEmpty()
  theater: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsNumber()
  price: number;
}

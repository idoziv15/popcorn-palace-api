import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  @IsNotEmpty()
  showtimeId: number;

  @IsNumber()
  @IsNotEmpty()
  seatNumber: number;

  @IsUUID()
  userId: string;
}

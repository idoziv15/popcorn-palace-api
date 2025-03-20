import { Controller, Get, Post, Delete, Param, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { BookingService } from '../services/bookingService';
import { CreateBookingDto } from '../models/DTOs/bookingDTO';
import { Booking } from '../models/bookingEntity';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('/all')
  async getAllBookings() {
    return await this.bookingService.getAllBookings();
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async bookTicket(@Body() bookingData: CreateBookingDto): Promise<{ message: string; booking: Booking }> {
    return await this.bookingService.bookTicket(bookingData);
  }

  @Get(':id')
  async getBooking(@Param('id') id: string): Promise<Booking> {
    return await this.bookingService.getBookingById(id);
  }

  @Delete(':id')
  async cancelBooking(@Param('id') id: string): Promise<{ message: string }> {
    return await this.bookingService.cancelBooking(id);
  }
}

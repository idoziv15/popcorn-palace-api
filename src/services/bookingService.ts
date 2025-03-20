import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../models/bookingEntity';
import { Showtime } from '../models/showtimeEntity';
import { CreateBookingDto } from '../models/DTOs/bookingDTO';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(Showtime) private showtimeRepo: Repository<Showtime>,
  ) {}

  async getAllBookings(): Promise<Booking[]> {
    try {
      return await this.bookingRepo.find({ relations: ['showtime'] });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch bookings');
    }
  }

  async bookTicket(data: CreateBookingDto): Promise<{ message: string; booking: Booking }> {
    try {
      const showtime = await this.showtimeRepo.findOne({ where: { id: data.showtimeId } });
      if (!showtime) {
        throw new NotFoundException('Showtime not found');
      }

      const existingBooking = await this.bookingRepo.findOne({
        where: { showtime, seatNumber: data.seatNumber },
      });

      if (existingBooking) {
        throw new BadRequestException('Seat is already booked');
      }

      const booking = this.bookingRepo.create({
        showtime,
        seatNumber: data.seatNumber,
        userId: data.userId,
      });

      const savedBooking = await this.bookingRepo.save(booking);
      return { message: 'Ticket booked successfully', booking: savedBooking };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async getBookingById(id: string): Promise<Booking> {
    try {
      const booking = await this.bookingRepo.findOne({ where: { id }, relations: ['showtime'] });
      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }
      return booking;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Unexpected Error in getBookingById:`, error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async cancelBooking(id: string): Promise<{ message: string }> {
    try {
      const result = await this.bookingRepo.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }
      return { message: `Booking with ID ${id} cancelled successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Unexpected Error in deleteBooking:`, error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
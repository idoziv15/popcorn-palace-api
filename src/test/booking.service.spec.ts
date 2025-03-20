import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookingService } from '../services/bookingService';
import { Booking } from '../models/bookingEntity';
import { Showtime } from '../models/showtimeEntity';
import { CreateBookingDto } from '../models/DTOs/bookingDTO';

describe('BookingService', () => {
  let service: BookingService;
  let bookingRepo: Repository<Booking>;
  let showtimeRepo: Repository<Showtime>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(Booking),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Showtime),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    bookingRepo = module.get<Repository<Booking>>(getRepositoryToken(Booking));
    showtimeRepo = module.get<Repository<Showtime>>(getRepositoryToken(Showtime));

    // Mock `findOne` to return a valid showtime
    jest.spyOn(showtimeRepo, 'findOne').mockResolvedValue({
      id: 1,
      theater: "IMAX",
      startTime: new Date("2025-03-21T18:30:00.000Z"),
      endTime: new Date("2025-03-21T20:30:00.000Z"),
      price: 15.5,
      bookings: [],
      movie: {
        id: 1,
        title: "Example Movie",
        genre: "Action",
        duration: 120,
        rating: 8.5,
        releaseYear: 2023,
        showtimes: [],
      }
    });
  });

  const bookingData: Booking = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    showtime: {
      id: 1,
      theater: "IMAX",
      startTime: new Date("2025-03-21T18:30:00.000Z"),
      endTime: new Date("2025-03-21T20:30:00.000Z"),
      price: 15.5,
      bookings: [],
      movie: {
        id: 1,
        title: "Example Movie",
        genre: "Action",
        duration: 120,
        rating: 8.5,
        releaseYear: 2023,
        showtimes: [],
      }
    },
    seatNumber: 12,
    userId: "550e8400-e29b-41d4-a716-446655440000",
  };

  /** TEST: Get all bookings */
  it('should return all bookings', async () => {
    jest.spyOn(bookingRepo, 'find').mockResolvedValue([bookingData]);

    const result = await service.getAllBookings();
    expect(result).toEqual([bookingData]);
  });

  /** TEST: Get a booking by ID */
  it('should return a booking by ID', async () => {
    jest.spyOn(bookingRepo, 'findOne').mockResolvedValue(bookingData);

    const result = await service.getBookingById("123e4567-e89b-12d3-a456-426614174000");
    expect(result).toEqual(bookingData);
  });

  it('should throw NotFoundException if booking is not found', async () => {
    jest.spyOn(bookingRepo, 'findOne').mockResolvedValue(null);

    await expect(service.getBookingById("non-existing-id")).rejects.toThrow(NotFoundException);
  });

  /** TEST: Book a ticket */
  it('should create a new booking', async () => {
    const createBookingDto: CreateBookingDto = {
      showtimeId: 1,
      seatNumber: 12,
      userId: "550e8400-e29b-41d4-a716-446655440000",
    };

    jest.spyOn(bookingRepo, 'create').mockReturnValue(bookingData);
    jest.spyOn(bookingRepo, 'save').mockResolvedValue(bookingData);

    const result = await service.bookTicket(createBookingDto);
    expect(result.booking).toEqual(bookingData);
  });

  it('should throw NotFoundException if showtime does not exist', async () => {
    jest.spyOn(showtimeRepo, 'findOne').mockResolvedValue(null);

    const createBookingDto: CreateBookingDto = {
      showtimeId: 999,
      seatNumber: 12,
      userId: "550e8400-e29b-41d4-a716-446655440000",
    };

    await expect(service.bookTicket(createBookingDto)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if seat is already booked', async () => {
    jest.spyOn(bookingRepo, 'findOne').mockResolvedValue(bookingData);

    const createBookingDto: CreateBookingDto = {
      showtimeId: 1,
      seatNumber: 12,
      userId: "550e8400-e29b-41d4-a716-446655440000",
    };

    await expect(service.bookTicket(createBookingDto)).rejects.toThrow(BadRequestException);
  });

  /** TEST: Cancel a booking */
  it('should delete a booking', async () => {
    jest.spyOn(bookingRepo, 'delete').mockResolvedValue({ affected: 1 } as any);

    const result = await service.cancelBooking("123e4567-e89b-12d3-a456-426614174000");
    expect(result).toEqual({ message: "Booking with ID 123e4567-e89b-12d3-a456-426614174000 cancelled successfully" });
  });

  it('should throw NotFoundException if booking does not exist when deleting', async () => {
    jest.spyOn(bookingRepo, 'delete').mockResolvedValue({ affected: 0 } as any);

    await expect(service.cancelBooking("non-existing-id")).rejects.toThrow(NotFoundException);
  });
});

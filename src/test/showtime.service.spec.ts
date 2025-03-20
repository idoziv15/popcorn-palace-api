import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { Showtime } from '../models/showtimeEntity';
import { ShowtimeService } from '../services/showtimeService';
import { CreateShowtimeDto } from '../models/DTOs/showtimeDTO';
import { UpdateShowtimeDto } from '../models/DTOs/UpdateShowtimeDTO';
import { Movie } from '../models/movieEntity';

describe('ShowtimeService', () => {
  let service: ShowtimeService;
  let showtimeRepo: Repository<Showtime>;
  let movieRepo: Repository<Movie>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimeService,
        {
          provide: getRepositoryToken(Showtime),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Movie),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ShowtimeService>(ShowtimeService);
    showtimeRepo = module.get<Repository<Showtime>>(getRepositoryToken(Showtime));
    movieRepo = module.get<Repository<Movie>>(getRepositoryToken(Movie));

    jest.spyOn(movieRepo, 'findOne').mockResolvedValue({
      id: 1,
      title: "Example Movie",
      genre: "Action",
      duration: 120,
      rating: 8.5,
      releaseYear: 2023,
      showtimes: [],
    });
  });

  const showtimeData: Showtime = {
    id: 1,
    movie: {
      id: 1,
      title: "Example Movie",
      genre: "Action",
      duration: 120,
      rating: 8.5,
      releaseYear: 2023,
      showtimes: [],
    },
    theater: "Cinema 1",
    startTime: new Date("2025-03-21T19:00:00.000Z"),
    endTime: new Date("2025-03-21T21:00:00.000Z"),
    price: 15,
    bookings: [],
  };

  /** TEST: Get all showtimes */
  it('should return all showtimes', async () => {
    jest.spyOn(showtimeRepo, 'find').mockResolvedValue([showtimeData]);

    const result = await service.getAllShowtimes();
    expect(result).toEqual([showtimeData]);
  });

  /** TEST: Get showtime by ID */
  it('should return a showtime by ID', async () => {
    jest.spyOn(showtimeRepo, 'findOne').mockResolvedValue(showtimeData);

    const result = await service.getShowtimeById(1);
    expect(result).toEqual(showtimeData);
  });

  it('should throw NotFoundException if showtime is not found', async () => {
    jest.spyOn(showtimeRepo, 'findOne').mockResolvedValue(null);

    await expect(service.getShowtimeById(1)).rejects.toThrow(NotFoundException);
  });

  /** TEST: Add a new showtime */
  it('should add a showtime', async () => {
    const createShowtimeDto: CreateShowtimeDto = {
      movieId: 1,
      theater: "Cinema 1",
      startTime: "2025-03-21T19:00:00.000Z",
      endTime: "2025-03-21T21:00:00.000Z",
      price: 15,
    };

    jest.spyOn(showtimeRepo, 'create').mockReturnValue(showtimeData);
    jest.spyOn(showtimeRepo, 'save').mockResolvedValue(showtimeData);

    const result = await service.addShowtime(createShowtimeDto);
    expect(result).toEqual(showtimeData);
  });

  it('should throw BadRequestException if movie ID is invalid', async () => {
    jest.spyOn(movieRepo, 'findOne').mockResolvedValue(null);

    const createShowtimeDto: CreateShowtimeDto = {
      movieId: 999,
      theater: "Cinema 1",
      startTime: "2025-03-21T19:00:00.000Z",
      endTime: "2025-03-21T21:00:00.000Z",
      price: 15,
    };

    await expect(service.addShowtime(createShowtimeDto)).rejects.toThrow(BadRequestException);
  });

  it('should throw ConflictException if there is an overlapping showtime', async () => {
    jest.spyOn(showtimeRepo, 'findOne').mockResolvedValue(showtimeData);

    const createShowtimeDto: CreateShowtimeDto = {
      movieId: 1,
      theater: "Cinema 1",
      startTime: "2025-03-21T19:30:00.000Z",
      endTime: "2025-03-21T20:30:00.000Z",
      price: 15,
    };

    await expect(service.addShowtime(createShowtimeDto)).rejects.toThrow(ConflictException);
  });

  /** TEST: Update a showtime */
  it('should update a showtime', async () => {
    const updateShowtimeDto: UpdateShowtimeDto = {
      theater: "Updated Theater",
    };

    jest.spyOn(showtimeRepo, 'findOne').mockResolvedValue(showtimeData);
    jest.spyOn(showtimeRepo, 'save').mockResolvedValue({ ...showtimeData, theater: "Updated Theater" });

    const result = await service.updateShowtime(1, updateShowtimeDto);
    expect(result.theater).toEqual("Updated Theater");
  });

  it('should throw NotFoundException if showtime is not found when updating', async () => {
    jest.spyOn(showtimeRepo, 'findOne').mockResolvedValue(null);

    const updateShowtimeDto: UpdateShowtimeDto = {
      theater: "Updated Theater",
    };

    await expect(service.updateShowtime(99, updateShowtimeDto)).rejects.toThrow(NotFoundException);
  });

  /** TEST: Delete a showtime */
  it('should delete a showtime', async () => {
    jest.spyOn(showtimeRepo, 'delete').mockResolvedValue({ affected: 1 } as any);

    const result = await service.deleteShowtime(1);
    expect(result).toEqual({ message: 'Showtime with ID 1 deleted successfully' });
  });

  it('should throw NotFoundException if showtime does not exist when deleting', async () => {
    jest.spyOn(showtimeRepo, 'delete').mockResolvedValue({ affected: 0 } as any);

    await expect(service.deleteShowtime(99)).rejects.toThrow(NotFoundException);
  });
});

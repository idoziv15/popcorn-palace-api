import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Showtime } from '../models/showtimeEntity';
import { Movie } from '../models/movieEntity';
import { CreateShowtimeDto } from '../models/DTOs/showtimeDTO';
import { UpdateShowtimeDto } from '../models/DTOs/UpdateShowtimeDTO';

@Injectable()
export class ShowtimeService {
  constructor(
    @InjectRepository(Showtime) private showtimeRepo: Repository<Showtime>,
    @InjectRepository(Movie) private movieRepo: Repository<Movie>,
  ) { }

  async getAllShowtimes(): Promise<Showtime[]> {
    try {
      return await this.showtimeRepo.find({ relations: ['movie'] });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch showtimes');
    }
  }

  async getShowtimeById(id: number): Promise<Showtime> {
    try {
      if (!id) {
        throw new BadRequestException('showtimeId is required.');
      }

      const showtime = await this.showtimeRepo.findOne({ where: { id }, relations: ['movie'] });
      if (!showtime) {
        throw new NotFoundException(`Showtime with ID ${id} not found`);
      }
      return showtime;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Unexpected Error in getShowtimeById:', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async addShowtime(data: CreateShowtimeDto): Promise<Showtime> {
    try {
      if (!data.movieId) {
        throw new BadRequestException('movieId must be provided and should be a valid number.');
      }

      if (!this.movieRepo) {
        throw new InternalServerErrorException("movieRepo is undefined");
      }

      const movie = await this.movieRepo.findOne({ where: { id: data.movieId } });
      if (!movie) {
        throw new BadRequestException('Invalid movie ID');
      }

      // Check for overlapping showtimes in the same theater
      const overlappingShowtime = await this.showtimeRepo.findOne({
        where: {
          theater: data.theater,
          startTime: LessThanOrEqual(new Date(data.endTime)),
          endTime: MoreThanOrEqual(new Date(data.startTime))
        }
      });

      if (overlappingShowtime) {
        throw new ConflictException(`A showtime already exists in ${data.theater} between ${data.startTime} and ${data.endTime}.`);
      }

      const showtime = this.showtimeRepo.create({
        movie,
        theater: data.theater,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        price: data.price,
      });

      return await this.showtimeRepo.save(showtime);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      console.error('Unexpected Error in addShowtime:', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateShowtime(id: number, updateData: UpdateShowtimeDto): Promise<Showtime> {
    try {
      if (!id) {
        throw new BadRequestException('showtimeId is required.');
      }

      const showtime = await this.showtimeRepo.findOne({ where: { id } });

      if (!showtime) {
        throw new NotFoundException(`Showtime with ID ${id} not found`);
      }

      if (updateData.movieId) {
        const movie = await this.movieRepo.findOne({ where: { id: updateData.movieId } });
        if (!movie) {
          throw new BadRequestException('Invalid movie ID');
        }
        showtime.movie = movie;
      }

      if (updateData.theater) showtime.theater = updateData.theater;
      if (updateData.startTime) showtime.startTime = new Date(updateData.startTime);
      if (updateData.endTime) showtime.endTime = new Date(updateData.endTime);
      if (updateData.price) showtime.price = updateData.price;

      return await this.showtimeRepo.save(showtime);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Unexpected Error in updateShowtime:', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteShowtime(id: number): Promise<{ message: string }> {
    try {
      if (!id) {
        throw new BadRequestException('showtimeId is undefined! Cannot delete.');
      }

      const result = await this.showtimeRepo.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Showtime with ID ${id} not found`);
      }
      return { message: `Showtime with ID ${id} deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Unexpected Error in deleteShowtime:', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}

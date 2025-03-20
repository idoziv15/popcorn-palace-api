import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../models/movieEntity';
import { CreateMovieDto } from '../models/DTOs/movieDTO';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie) private movieRepo: Repository<Movie>,
  ) {}

  async getAllMovies(): Promise<Movie[]> {
    try {
      return await this.movieRepo.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch movies');
    }
  }

  async getMovieById(id: number): Promise<Movie> {
    try {
      const movie = await this.movieRepo.findOne({ where: { id } });
      if (!movie) {
        throw new NotFoundException(`Movie with ID ${id} not found`);
      }
      return movie;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; 
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async addMovie(movieData: CreateMovieDto): Promise<{ message: string; movie: Movie }> {
    try {
      const movie = this.movieRepo.create(movieData);
      const savedMovie = await this.movieRepo.save(movie);
      return { message: 'Movie added successfully', movie: savedMovie };
    } catch (error) {
      throw new InternalServerErrorException('Failed to add movie');
    }
  }

  async updateMovie(id: number, movieData: Partial<CreateMovieDto>): Promise<{ message: string; updatedMovie: Movie }> {
    try {
      const existingMovie = await this.movieRepo.findOne({ where: { id } });
      if (!existingMovie) {
        throw new NotFoundException(`Movie with ID ${id} not found`);
      }

      await this.movieRepo.update(id, movieData);
      const updatedMovie = await this.movieRepo.findOne({ where: { id } });

      return { message: 'Movie updated successfully', updatedMovie };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update movie');
    }
  }

  async deleteMovie(id: number): Promise<{ message: string }> {
    try {
      const result = await this.movieRepo.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Movie with ID ${id} not found`);
      }
      return { message: `Movie with ID ${id} deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
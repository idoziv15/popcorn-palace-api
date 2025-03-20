import { Controller, Get, Post, Put, Delete, Param, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { MovieService } from '../services/movieService';
import { CreateMovieDto } from '../models/DTOs/movieDTO';
import { Movie } from '../models/movieEntity';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('all')
  async getAllMovies(): Promise<Movie[]> {
    return await this.movieService.getAllMovies();
  }

  @Get(':id')
  async getMovieById(@Param('id') id: number): Promise<Movie> {
    return await this.movieService.getMovieById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async addMovie(@Body() movieData: CreateMovieDto): Promise<{ message: string; movie: Movie }> {
    return await this.movieService.addMovie(movieData);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateMovie(@Param('id') id: number, @Body() movieData: Partial<CreateMovieDto>): Promise<{ message: string; updatedMovie: Movie }> {
    return await this.movieService.updateMovie(id, movieData);
  }

  @Delete(':id')
  async deleteMovie(@Param('id') id: number): Promise<{ message: string }> {
    return await this.movieService.deleteMovie(id);
  }
}
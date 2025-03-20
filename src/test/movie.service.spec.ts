import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { MovieService } from '../services/movieService';
import { Movie } from '../models/movieEntity';
import { CreateMovieDto } from '../models/DTOs/movieDTO';

describe('MovieService', () => {
  let service: MovieService;
  let repo: Repository<Movie>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: getRepositoryToken(Movie),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
    repo = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  // Mock movie data
  const mockMovie: Movie = {
    id: 1,
    title: 'Inception',
    genre: 'Sci-Fi',
    duration: 148,
    rating: 8.8,
    releaseYear: 2010,
    showtimes: [],
  };

  const createMovieDto: CreateMovieDto = {
    title: 'Inception',
    genre: 'Sci-Fi',
    duration: 148,
    rating: 8.8,
    releaseYear: 2010,
  };

  /** TEST: Get all movies */
  it('should return all movies', async () => {
    jest.spyOn(repo, 'find').mockResolvedValue([mockMovie]);

    const result = await service.getAllMovies();
    expect(result).toEqual([mockMovie]);
  });

  /** TEST: Get movie by ID */
  it('should return a movie by ID', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue(mockMovie);

    const result = await service.getMovieById(1);
    expect(result).toEqual(mockMovie);
  });

  it('should throw NotFoundException if movie is not found', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue(null);

    await expect(service.getMovieById(1)).rejects.toThrow(NotFoundException);
  });

  /** TEST: Add a new movie */
  it('should add a movie', async () => {
    jest.spyOn(repo, 'create').mockReturnValue(mockMovie);
    jest.spyOn(repo, 'save').mockResolvedValue(mockMovie);

    const result = await service.addMovie(createMovieDto);
    expect(result).toEqual({ message: 'Movie added successfully', movie: mockMovie });
  });

  it('should throw InternalServerErrorException when adding a movie fails', async () => {
    jest.spyOn(repo, 'save').mockRejectedValue(new Error());

    await expect(service.addMovie(createMovieDto)).rejects.toThrow(InternalServerErrorException);
  });

  /** TEST: Update a movie */
  it('should update a movie', async () => {
    const updatedMovie = { ...mockMovie, title: 'Updated Title' };

    jest.spyOn(repo, 'findOne').mockResolvedValue(mockMovie);
    jest.spyOn(repo, 'update').mockResolvedValue(undefined);
    jest.spyOn(repo, 'findOne').mockResolvedValue(updatedMovie);

    const result = await service.updateMovie(1, { title: 'Updated Title' });
    expect(result).toEqual({ message: 'Movie updated successfully', updatedMovie });
  });

  it('should throw NotFoundException when updating a non-existent movie', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue(null);

    await expect(service.updateMovie(99, { title: 'Updated Title' })).rejects.toThrow(NotFoundException);
  });

  /** TEST: Delete a movie */
  it('should delete a movie', async () => {
    jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 1 } as any);

    const result = await service.deleteMovie(1);
    expect(result).toEqual({ message: 'Movie with ID 1 deleted successfully' });
  });

  it('should throw NotFoundException when deleting a non-existent movie', async () => {
    jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 0 } as any);

    await expect(service.deleteMovie(99)).rejects.toThrow(NotFoundException);
  });
});

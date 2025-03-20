import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../app.module';
import { Movie } from '../models/movieEntity';

describe('Movies (e2e)', () => {
  let app: INestApplication;
  let repo: Repository<Movie>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    repo = moduleFixture.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  afterAll(async () => {
    await app.close();
  });

  let movieId: number;

  /** TEST: Add a new movie */
  it('should create a new movie', async () => {
    const movieData = {
      title: 'Inception',
      genre: 'Sci-Fi',
      duration: 148,
      rating: 8.8,
      releaseYear: 2010,
    };

    const response = await request(app.getHttpServer())
      .post('/movies')
      .send(movieData)
      .expect(201);

    expect(response.body.movie).toBeDefined();
    expect(response.body.movie.title).toBe(movieData.title);
    expect(response.body.movie.genre).toBe(movieData.genre);

    movieId = response.body.movie.id;
  });

  /** TEST: Retrieve all movies */
  it('should retrieve all movies', async () => {
    const response = await request(app.getHttpServer())
      .get('/movies/all')
      .expect(200);

    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  /** TEST: Retrieve a single movie by ID */
  it('should retrieve a movie by ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/movies/${movieId}`)
      .expect(200);

    expect(response.body.id).toBe(movieId);
    expect(response.body.title).toBe('Inception');
  });

  /** TEST: Handle non-existent movie */
  it('should return 404 if movie not found', async () => {
    await request(app.getHttpServer())
      .get('/movies/99999')
      .expect(404);
  });

  /** TEST: Update a movie */
  it('should update an existing movie', async () => {
    const updatedData = { title: 'Interstellar', rating: 9.0 };

    const response = await request(app.getHttpServer())
      .put(`/movies/${movieId}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.updatedMovie.title).toBe(updatedData.title);
    expect(response.body.updatedMovie.rating).toBe(updatedData.rating);
  });

  /** TEST: Handle updating a non-existent movie */
  it('should return 404 when updating a non-existent movie', async () => {
    await request(app.getHttpServer())
      .put('/movies/99999')
      .send({ title: 'Invalid' })
      .expect(404);
  });

  /** TEST: Delete a movie */
  it('should delete a movie', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/movies/${movieId}`)
      .expect(200);

    expect(response.body.message).toContain('deleted successfully');
  });

  /** TEST: Handle deleting a non-existent movie */
  it('should return 404 when deleting a non-existent movie', async () => {
    await request(app.getHttpServer())
      .delete('/movies/99999')
      .expect(404);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '../app.module';
import { Showtime } from '../models/showtimeEntity';
import { Movie } from '../models/movieEntity';

describe('Showtimes (e2e)', () => {
  let app: INestApplication;
  let showtimeRepo: Repository<Showtime>;
  let movieRepo: Repository<Movie>;
  let movieId: number;
  let showtimeId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    showtimeRepo = moduleFixture.get<Repository<Showtime>>(getRepositoryToken(Showtime));
    movieRepo = moduleFixture.get<Repository<Movie>>(getRepositoryToken(Movie));

    // Create a movie first since showtime depends on it
    const movieResponse = await request(app.getHttpServer())
      .post('/movies')
      .send({
        title: 'Inception',
        genre: 'Sci-Fi',
        duration: 148,
        rating: 8.8,
        releaseYear: 2010,
      })
      .expect(201);

    movieId = movieResponse.body.movie.id;
  });

  afterAll(async () => {
    await app.close();
  });

  /** TEST: Create a new showtime */
  it('should create a new showtime', async () => {
    const response = await request(app.getHttpServer())
      .post('/showtimes')
      .send({
        movieId: movieId,
        theater: 'IMAX 1',
        startTime: '2025-03-22T18:30:00.000Z',
        endTime: '2025-03-22T20:30:00.000Z',
        price: 15.5,
      });

    expect(response.status).toBe(201);

    showtimeId = response.body.id;
    expect(response.body.theater).toBe('IMAX 1');
  });

  /** TEST: Retrieve all showtimes */
  it('should retrieve all showtimes', async () => {
    const response = await request(app.getHttpServer()).get('/showtimes/all').expect(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  /** TEST: Retrieve a showtime by ID */
  it('should retrieve a showtime by ID', async () => {
    const response = await request(app.getHttpServer()).get(`/showtimes/${showtimeId}`).expect(200);
    expect(response.body.id).toBe(showtimeId);
  });

  /** TEST: Update a showtime */
  it('should update a showtime', async () => {
    const response = await request(app.getHttpServer())
      .put(`/showtimes/${showtimeId}`)
      .send({ theater: 'VIP Lounge' })
      .expect(200);
    expect(response.body.theater).toBe('VIP Lounge');
  });

  /** TEST: Try to update a non-existent showtime */
  it('should return 404 when updating a non-existent showtime', async () => {
    await request(app.getHttpServer()).put('/showtimes/9999').send({ theater: 'VIP' }).expect(404);
  });

  /** TEST: Delete a showtime */
  it('should delete a showtime', async () => {
    await request(app.getHttpServer()).delete(`/showtimes/${showtimeId}`);
  });

  /** TEST: Try to delete a non-existent showtime */
  it('should return 404 when deleting a non-existent showtime', async () => {
    await request(app.getHttpServer()).delete('/showtimes/9999').expect(404);
  });
});

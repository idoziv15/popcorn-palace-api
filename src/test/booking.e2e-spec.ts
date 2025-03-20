import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { AppModule } from '../app.module';

describe('Bookings (e2e)', () => {
  let app: INestApplication;
  let showtimeId: number;
  let bookingId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create a movie first (Required before showtime & booking)
    const movieResponse = await request(app.getHttpServer())
      .post('/movies')
      .send({
        title: 'Inception',
        genre: 'Sci-Fi',
        duration: 120,
        rating: 9,
        releaseYear: 2010,
      })
      .expect(201);

    const movieId = movieResponse.body.movie.id;
    if (!movieId) throw new Error('Movie creation failed!');

    // Create a showtime for the booking
    const showtimeResponse = await request(app.getHttpServer())
      .post('/showtimes')
      .send({
        movieId: movieId,
        theater: 'IMAX 3',
        startTime: '2025-04-13T18:30:00.000Z',
        endTime: '2025-04-13T20:30:00.000Z',
        price: 17.5,
      })
      .expect(201);

    showtimeId = showtimeResponse.body.id;
    if (!showtimeId) throw new Error('Showtime creation failed!');
  });

  /** TEST: Create a new booking */
  it('should create a new booking', async () => {
    const response = await request(app.getHttpServer())
      .post('/bookings')
      .send({
        showtimeId: showtimeId,
        seatNumber: 2,
        userId: uuidv4(),
      })
      .expect(201);

    bookingId = response.body.booking.id;
    expect(response.body.booking).toHaveProperty('id');
    expect(response.body.booking.seatNumber).toBe(2);
  });

  /** TEST: Retrieve all bookings */
  it('should retrieve all bookings', async () => {
    const response = await request(app.getHttpServer()).get('/bookings/all').expect(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  /** TEST: Retrieve a booking by ID */
  it('should retrieve a booking by ID', async () => {
    const response = await request(app.getHttpServer()).get(`/bookings/${bookingId}`).expect(200);
    expect(response.body.id).toBe(bookingId);
  });

  /** TEST: Try to retrieve a non-existent booking */
  it('should return 404 when retrieving a non-existent booking', async () => {
    await request(app.getHttpServer()).get(`/bookings/${uuidv4()}`).expect(404);
  });

  /** TEST: Delete a booking */
  it('should delete a booking', async () => {
    await request(app.getHttpServer()).delete(`/bookings/${bookingId}`).expect(200);
  });

  /** TEST: Try to delete a non-existent booking */
  it('should return 404 when deleting a non-existent booking', async () => {
    await request(app.getHttpServer()).delete(`/bookings/${uuidv4()}`).expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
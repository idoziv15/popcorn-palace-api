import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { databaseConfig } from './config/database.config';
import { MovieController } from './controllers/movieController';
import { ShowtimeController } from './controllers/showtimeController';
import { BookingController } from './controllers/bookingController';
import { MovieService } from './services/movieService';
import { ShowtimeService } from './services/showtimeService';
import { BookingService } from './services/bookingService';
import { Movie } from './models/movieEntity';
import { Showtime } from './models/showtimeEntity';
import { Booking } from './models/bookingEntity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([Movie, Showtime, Booking]),
  ],
  controllers: [AppController, MovieController, ShowtimeController, BookingController],
  providers: [AppService, MovieService, ShowtimeService, BookingService],
})
export class AppModule {}
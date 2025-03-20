import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Movie } from '../models/movieEntity';
import { Showtime } from '../models/showtimeEntity';
import { Booking } from '../models/bookingEntity';

ConfigModule.forRoot();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'popcorn-palace-db',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER || 'popcorn-palace',
  password: process.env.DATABASE_PASSWORD || 'popcorn-palace',
  database: process.env.DATABASE_NAME || 'popcorn-palace',
  entities: [Movie, Showtime, Booking],
  autoLoadEntities: true,
  synchronize: true
};

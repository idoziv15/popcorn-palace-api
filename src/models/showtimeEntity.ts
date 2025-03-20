import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Movie } from './movieEntity';
import { Booking } from './bookingEntity';

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Movie, (movie) => movie.showtimes, { onDelete: 'CASCADE' })
  movie: Movie;

  @Column()
  theater: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({ type: 'decimal' })
  price: number;

  @OneToMany(() => Booking, (booking) => booking.showtime, { cascade: ['remove'] })
  bookings: Booking[];
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Showtime } from './showtimeEntity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Showtime, (showtime) => showtime.bookings, { onDelete: 'CASCADE' })
  showtime: Showtime;

  @Column()
  seatNumber: number;

  @Column()
  userId: string;
}

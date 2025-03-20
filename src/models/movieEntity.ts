import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Showtime } from './showtimeEntity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  genre: string;

  @Column()
  duration: number;

  @Column({ type: 'float' })
  rating: number;

  @Column()
  releaseYear: number;

  @OneToMany(() => Showtime, (showtime) => showtime.movie, { cascade: ['remove'] })
  showtimes: Showtime[];
}

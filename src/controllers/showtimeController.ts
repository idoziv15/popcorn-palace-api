import { Controller, Get, Post, Put, Delete, Param, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { ShowtimeService } from '../services/showtimeService';
import { Showtime } from '../models/showtimeEntity';
import { CreateShowtimeDto } from '../models/DTOs/showtimeDTO';
import { UpdateShowtimeDto } from '../models/DTOs/UpdateShowtimeDTO';

@Controller('showtimes')
export class ShowtimeController {
  constructor(private readonly showtimeService: ShowtimeService) {}

  @Get('/all')
  async getAllShowtimes() {
    return await this.showtimeService.getAllShowtimes();
  }

  @Get(':id')
  async getShowtime(@Param('id') id: number): Promise<Showtime> {
    return await this.showtimeService.getShowtimeById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async addShowtime(@Body() showtimeData: CreateShowtimeDto): Promise<Showtime> {
    return await this.showtimeService.addShowtime(showtimeData);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateShowtime(@Param('id') id: number, @Body() updateData: UpdateShowtimeDto): Promise<Showtime> {
    return await this.showtimeService.updateShowtime(id, updateData);
  }

  @Delete(':id')
  async deleteShowtime(@Param('id') id: number): Promise<{ message: string }> {
    return await this.showtimeService.deleteShowtime(id);
  }
}

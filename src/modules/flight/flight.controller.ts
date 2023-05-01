import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FlightService } from './flight.service';

@ApiTags('Flight services')
@Controller('flight')
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @Get('journey/:origin/:destination/:currency')
  createRes(@Param() data: object ) {
    return this.flightService.getJourney(data);
  }
}

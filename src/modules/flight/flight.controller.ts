import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FlightService } from './flight.service';
import { FlightJourneyDto } from './dto/flight-journey.dto';

@ApiTags('Flight services')
@Controller('flight')
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @Get('journey/:origin/:destination')
  createRes(@Param() data: object ) {
    return this.flightService.getJourney(data);
  }
}

import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FlightJourneyDto {
  @ApiProperty()
  @IsNotEmpty()
  origin: string;

  @ApiProperty()
  @IsNotEmpty()
  destination: string;

}

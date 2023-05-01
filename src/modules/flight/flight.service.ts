import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { Flight } from 'src/models/flight';
import { Response } from 'src/models/response';

@Injectable()
export class FlightService {

    constructor(
        private http: HttpService,
        private configService: ConfigService
    ) {
    }

    //ENV variables
    url = this.configService.get<string>('URL');
    allFlights = [];

    async getJourney(data: object) {

        const response: Response = {
            response: false,
            data: [],
            error: ""
        }

        try {
            if (this.allFlights.length === 0) {
                const flightsReq: any = await lastValueFrom(
                    this.http.get(this.url)
                )

                if (flightsReq.statusText === 'OK') {
                    this.allFlights = flightsReq.data;
                } else {
                    //error en la peticion retornar el error
                }
            }

            const journeys = this.searchFlights(data['origin'], data['destination'], [], [], [], []);

            const dataResponse = journeys.map((flights: Flight[]) => {
    
                flights = flights.map((flight: Flight) => {
                    return {
                        origin: flight['departureStation'],
                        destination: flight['arrivalStation'],
                        price: flight['price'],
                        transport: {
                            flightCarrier: flight['flightCarrier'],
                            flightNumber: flight['flightNumber']
                        }
                    }
                })

                return {
                    origin: data['origin'],
                    destination: data['destination'],
                    price: this.calculateTotal(flights),
                    stops: flights.length - 1,
                    flights: flights
                };
            })

            response.data = dataResponse;
            response['response'] = true;

            return response
        } catch (error) {

            response['error'] = error;

            return response;
        }

    }

    calculateTotal(flights: Flight[]): number {
        let total = 0;

        flights.map((flight:Flight) => total += flight['price']);

        return total;

    }

    searchFlights(origin: string, destination: string, route: any[], result: any[], flightVisited: any[], locationVisited: any[]): any[] {

        const routes = this.allFlights.filter((item) => item.departureStation === origin);

        routes.map((item) => {

            if (item.arrivalStation === destination) {
                route.push(item);
                result.push(route)
                route = [];
            }

            if (item.arrivalStation !== destination && !flightVisited.includes(item.flightNumber) && !locationVisited.includes(item.arrivalStation)) {
                const tempArr = [...route];
                tempArr.push(item);
                const tempVisited = [...locationVisited];
                tempVisited.push(item.departureStation);
                const tempFlight = [...flightVisited];
                tempFlight.push(item.flightNumber);
                this.searchFlights(item.arrivalStation, destination, tempArr, result, tempFlight, tempVisited);
            }

        })

        return result
    }
}

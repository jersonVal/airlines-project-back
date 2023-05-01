import { Flight } from "./flight";

export interface Journey {
    flights: Flight[];
    origin: string;
    destination: string;
    price: number;
    stops: number;
}
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'src/models/response';

@Injectable()
export class AuthService {

    constructor(
        private configService: ConfigService,
        private jwt: JwtService
    ) {
    }

    //ENV variables
    url = this.configService.get<string>('URL');
    allFlights = [];

    async generateToken() {

        const response:Response = {
            data: "",
            error: "",
            response: false
        }

        try {
            const firm = {
                date: new Date()
            }
      
            const token = this.jwt.sign(firm); 
            
            response.data = token;
            response.response = true;
    
            return response
        } catch (error) {
            response.error = error;
            return response;
        }

    }
  
}

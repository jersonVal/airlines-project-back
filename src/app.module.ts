import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FLightModule } from './modules/flight/flight.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    FLightModule,
    ConfigModule.forRoot({ isGlobal: true })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

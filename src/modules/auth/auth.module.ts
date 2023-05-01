import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './auth.strategy';

@Module({
  imports: [
    HttpModule,
    JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          return {
            secret: configService.get<string>('SECRET_JWT'),
            signOptions: { expiresIn: '5m' },
          };
        },
      }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

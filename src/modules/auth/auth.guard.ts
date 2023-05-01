import { ExecutionContext, HttpException, Injectable, CanActivate } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {

  constructor(
    private reflector: Reflector,
    private jwt: JwtService,
    private configService: ConfigService
    ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    

    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if(!token || token === 'null'){
      throw new HttpException({
        error: 401,
        message: "UnauthorizedException"
      }, 401);
    }else{

      let validate = "";

      try {
        const test = this.jwt.verify(token, {ignoreExpiration: false, secret: this.configService.get<string>('SECRET_JWT')});
      } catch (error) {
        validate = error.message;
      }

      if(validate){
        throw new HttpException({
          error: 401,
          message: "UnauthorizedException"
        }, 401);
      } else {
        return true;
      }
       
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

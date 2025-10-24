import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos/auth.dto';
import { Public } from '@app/common/decorators/public.decorator';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //!=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: AuthDto, @Res() res: FastifyReply) {
    return await this.authService.login(
      res,
      signInDto.email,
      signInDto.password,
    );
  }

  //!=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  signOut(@Res() res: FastifyReply) {
    return this.authService.logout(res);
  }

  //!=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  @Public()
  @Post('generate')
  async regenerate(@Req() req: FastifyRequest) {
    return this.authService.generateNewAccessToken(req);
  }
}

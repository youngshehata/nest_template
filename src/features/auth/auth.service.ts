import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { PayloadDto } from './dtos/payload.dto';
import { ConfigService } from '@nestjs/config';
import { TResponse } from '@app/common/types/TResponse';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateBcryptPassword(
    passwordPlain: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(passwordPlain, passwordHash);
  }

  async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    return encryptedPassword;
  }

  //!=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  //! Login
  async login(res: FastifyReply, email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new HttpException('Invalid credentials', 401);
    }

    // const isCorrectPassword = await this.validateBcryptPassword(
    //   pass,
    //   user.password,
    // );

    const isCorrectPassword = user.password === pass;
    //TODO: check if password is correct with bcrypt on production

    if (!isCorrectPassword) {
      throw new HttpException('Invalid credentials', 401);
    }

    // getting user roles
    const usersRoles = await this.rolesService.getRolesForUser(user.id);

    const payload: PayloadDto = {
      sub: user.id,
      email: user.email,
      name: user.name,
      roles: usersRoles,
    };

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: +this.configService.getOrThrow<string>(
        'JWT_REFRESH_EXPIRES_IN_MS',
      ),
    });

    // Set the refresh token in an HTTP-only cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: +this.configService.getOrThrow<string>(
        'JWT_REFRESH_EXPIRES_IN_MS',
      ),
    });

    const accessToken = await this.jwtService.signAsync(payload);

    // Send response after both tokens are generated
    const response: TResponse = {
      data: {
        access_token: accessToken,
      },
      error: null,
      message: 'Successfully logged in',
      path: res.request.url,
      statusCode: 200,
      success: true,
      timestamp: new Date(),
    };
    return res.status(200).send(response);
  }

  //!=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  //! Logout
  async logout(res: FastifyReply): Promise<string> {
    res.cookie('refresh_token', '', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      expires: new Date(0), // Set the expiration date to a past time
    });

    const response: TResponse = {
      data: {},
      error: null,
      message: 'Successfully logged out',
      path: res.request.url,
      statusCode: 200,
      success: true,
      timestamp: new Date(),
    };
    return res.status(200).send(response);
  }

  //!=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  //! Regenrate Access Token
  async generateNewAccessToken(req: any): Promise<{ access_token: string }> {
    // im assuming the cookie will only have refresh token inside it
    const refreshTokenCookie = req.headers.cookie;
    if (!refreshTokenCookie) {
      throw new UnauthorizedException();
    }

    const refreshToken = refreshTokenCookie.replace('refresh_token=', '');
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken);
      const payload: PayloadDto = {
        sub: decoded.id,
        email: decoded.email,
        name: decoded.fullname,
        roles: decoded.roles,
      };
      const newAccessToken = await this.jwtService.signAsync(payload);
      return { access_token: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}

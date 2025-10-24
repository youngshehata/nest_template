import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { RolesService } from '../roles/roles.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: +configService.getOrThrow<string>('JWT_EXPIRES'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, RolesService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

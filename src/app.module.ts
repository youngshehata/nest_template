import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ErrorsModule } from './features/errors/errors.module';
import { LoggingModule } from './features/logging/logging.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ErrorsModule,
    LoggingModule,
    //BlacklistModule, // TODO: Uncomment to use blacklist
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerOptions = new DocumentBuilder()
  .setTitle('Nest Template')
  .setDescription('Nest Template API description')
  .setVersion('1.0')
  .build();

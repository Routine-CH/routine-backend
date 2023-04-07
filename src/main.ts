import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    // loggin purposes
    { logger: ['error', 'warn', 'log', 'debug', 'verbose'] },
  );

  // validationpipe
  app.useGlobalPipes(
    new ValidationPipe({
      // only validate the properties that are defined in the DTO
      whitelist: true,
      // skip missing properties
      skipMissingProperties: true,
    }),
  );

  // cookie parser  middleware
  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();

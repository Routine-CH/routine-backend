import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as timeout from 'connect-timeout';
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

  // set request timeout
  const requestTimeout = 20 * 1000; // 20 seconds
  app.use(timeout(requestTimeout));

  // cookie parser  middleware
  app.use(cookieParser());
  const port = process.env.PORT || 3000;
  console.log(port);
  await app.listen(port);
}
bootstrap();

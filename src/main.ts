import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  // init swagger
  const config = new DocumentBuilder()
    .setTitle('Routine')
    .setDescription('Routine API')
    .setVersion('1.0')
    .build();

  // Creating a swaggert module
  const document = SwaggerModule.createDocument(app, config);

  // Add swagger endpoint to the app
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();

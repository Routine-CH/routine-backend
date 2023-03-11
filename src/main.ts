import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // validationpipe
  app.useGlobalPipes(
    new ValidationPipe({
      // only validate the properties that are defined in the DTO
      whitelist: true,
    }),
  );

  // init swagger
  const config = new DocumentBuilder()
    .setTitle('Routine')
    .setDescription('Routine API')
    .setVersion('0.1')
    .build();

  // Creating a swaggert module
  const document = SwaggerModule.createDocument(app, config);

  // Add swagger endpoint to the app
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();

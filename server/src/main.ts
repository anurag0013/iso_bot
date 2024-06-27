import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigurationService } from './configuration/configuration.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configurationService = app.get(ConfigurationService);
  app.enableCors({origin:"*"});
  app.setGlobalPrefix("/api/v1");
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configurationService.getPort());
}
bootstrap();

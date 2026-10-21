import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp, setupSwagger } from './app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  setupSwagger(app);

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
  Logger.log(
    `API: http://localhost:${port}  |  Swagger: http://localhost:${port}/docs`,
    'Bootstrap',
  );
}

void bootstrap();

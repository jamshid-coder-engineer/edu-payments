import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { corsOrigins } from './common/app-config';

/** Ilova va testlar uchun umumiy sozlamalar. */
export function configureApp(app: INestApplication): void {
  // Xavfsizlik sarlavhalari, X-Powered-By o'chiriladi.
  // upgrade-insecure-requests o'chirilgan: lokal tarmoqda (http://192.168...) ishlashi uchun
  app.use(
    helmet({
      contentSecurityPolicy: { directives: { upgradeInsecureRequests: null } },
    }),
  );
  app.enableCors({ origin: corsOrigins() }); // faqat ruxsat etilgan frontend
  app.enableShutdownHooks(); // to'xtatilganda baza ulanishi yopiladi
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO'da yo'q maydonlar olib tashlanadi
      forbidNonWhitelisted: true, // ...yoki xato qaytariladi
      transform: true,
    }),
  );
}

/** Swagger hujjati: /docs */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle("O'quv markazi: to'lovlar API")
    .setDescription("O'quvchilar, to'lovlar va oylik qarzdorlar")
    .setVersion('1.0')
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));
}

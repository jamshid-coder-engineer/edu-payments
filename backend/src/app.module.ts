import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { rateLimitPerMinute } from './common/app-config';
import { DebtorsModule } from './debtors/debtors.module';
import { PaymentsModule } from './payments/payments.module';
import { PrismaModule } from './prisma/prisma.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // .env faylini o'qiydi
    // Bitta IP dan juda ko'p so'rov kelsa 429 qaytadi
    ThrottlerModule.forRootAsync({
      useFactory: () => [{ ttl: 60_000, limit: rateLimitPerMinute() }],
    }),
    PrismaModule,
    StudentsModule,
    PaymentsModule,
    DebtorsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}

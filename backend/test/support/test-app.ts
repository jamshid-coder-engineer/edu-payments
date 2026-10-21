import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { configureApp } from '../../src/app.setup';
import { PrismaService } from '../../src/prisma/prisma.service';

export const validStudent = {
  name: 'Aliyev Vali',
  phone: '+998901234567',
  group: 'Frontend-1',
  monthlyFee: 500_000,
  joinedAt: '2026-08-01',
};

/**
 * Har bir e2e fayl uchun ilova: beforeAll da ishga tushadi,
 * har bir testdan oldin baza tozalanadi, oxirida yopiladi.
 */
export function useTestApp() {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.payment.deleteMany();
    await prisma.student.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  const http = () => request(app.getHttpServer());

  const createStudent = async (data: Partial<typeof validStudent> = {}) => {
    const res = await http()
      .post('/students')
      .send({ ...validStudent, ...data })
      .expect(201);
    return res.body as { id: number };
  };

  const addPayment = (studentId: number, amount: number, paidAt?: string) =>
    http().post('/payments').send({ studentId, amount, paidAt });

  return { http, createStudent, addPayment, prisma: () => prisma };
}

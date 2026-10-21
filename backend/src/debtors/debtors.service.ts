import { Injectable } from '@nestjs/common';
import { monthRange } from '../common/date.util';
import { PrismaService } from '../prisma/prisma.service';
import { calculateDebtors, DebtorRow } from './debt-calculator';

@Injectable()
export class DebtorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByMonth(month: string): Promise<DebtorRow[]> {
    const { start, end } = monthRange(month);

    // Ikkala so'rov parallel, indeks bo'yicha va faqat kerakli ustunlar bilan.
    // Hisobning o'zi toza funksiyada: calculateDebtors()
    const [students, payments] = await Promise.all([
      this.prisma.student.findMany({
        where: { joinedAt: { lt: end } },
        select: {
          id: true,
          name: true,
          phone: true,
          group: true,
          monthlyFee: true,
          joinedAt: true,
        },
      }),
      this.prisma.payment.findMany({
        where: { paidAt: { gte: start, lt: end } },
        select: { studentId: true, amount: true, paidAt: true },
      }),
    ]);

    return calculateDebtors(month, students, payments);
  }
}

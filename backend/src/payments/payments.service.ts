import { BadRequestException, Injectable } from '@nestjs/common';
import { Payment } from '@prisma/client';
import { appToday } from '../common/app-config';
import { PrismaService } from '../prisma/prisma.service';
import { StudentsService } from '../students/students.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly students: StudentsService,
  ) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    // O'quvchi mavjud bo'lmasa 404 qaytadi
    const student = await this.students.findOne(dto.studentId);

    const today = appToday();
    const paidAt = dto.paidAt ?? today;
    if (paidAt > today) {
      throw new BadRequestException([
        "To'lov sanasi kelajakda bo'lishi mumkin emas",
      ]);
    }
    if (paidAt < student.joinedAt) {
      throw new BadRequestException([
        `To'lov sanasi o'quvchi qo'shilgan sanadan (${student.joinedAt}) oldin bo'lishi mumkin emas`,
      ]);
    }

    return this.prisma.payment.create({
      data: { studentId: dto.studentId, amount: dto.amount, paidAt },
    });
  }

  /** O'quvchining to'lovlar tarixi, eng yangisi birinchi. */
  async findByStudent(studentId: number): Promise<Payment[]> {
    await this.students.findOne(studentId);
    return this.prisma.payment.findMany({
      where: { studentId },
      orderBy: [{ paidAt: 'desc' }, { id: 'desc' }],
    });
  }
}

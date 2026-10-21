import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Student } from '@prisma/client';
import { appToday } from '../common/app-config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateStudentDto): Promise<Student> {
    return this.prisma.student.create({
      data: { ...dto, joinedAt: dto.joinedAt ?? appToday() },
    });
  }

  findAll(): Promise<Student[]> {
    return this.prisma.student.findMany({
      orderBy: [{ group: 'asc' }, { name: 'asc' }],
    });
  }

  async findOne(id: number): Promise<Student> {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) {
      throw new NotFoundException(`O'quvchi topilmadi (id: ${id})`);
    }
    return student;
  }

  async update(id: number, dto: UpdateStudentDto): Promise<Student> {
    await this.findOne(id);
    if (dto.joinedAt) {
      await this.ensureNoPaymentsBefore(id, dto.joinedAt);
    }
    return this.prisma.student.update({ where: { id }, data: dto });
  }

  /** O'quvchi o'chirilsa, uning to'lovlari ham o'chadi (onDelete: Cascade). */
  async remove(id: number): Promise<Student> {
    await this.findOne(id);
    return this.prisma.student.delete({ where: { id } });
  }

  /** joinedAt keyinga surilsa, undan oldingi to'lovlar "osilib" qolmasligi kerak. */
  private async ensureNoPaymentsBefore(
    studentId: number,
    joinedAt: string,
  ): Promise<void> {
    const earlier = await this.prisma.payment.findFirst({
      where: { studentId, paidAt: { lt: joinedAt } },
      select: { paidAt: true },
      orderBy: { paidAt: 'asc' },
    });
    if (earlier) {
      throw new BadRequestException([
        `joinedAt ${earlier.paidAt} dagi to'lovdan keyin bo'lishi mumkin emas`,
      ]);
    }
  }
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { IsDateOnly } from '../../common/is-date-only.validator';
import { MAX_AMOUNT, MAX_ID } from '../../common/limits';

export class CreatePaymentDto {
  @ApiProperty({ example: 1 })
  @IsInt({ message: "studentId butun son bo'lishi kerak" })
  @Min(1)
  @Max(MAX_ID)
  studentId: number;

  @ApiProperty({
    example: 300000,
    description: "To'lov summasi, so'mda (butun son)",
  })
  @IsInt({ message: "Summa butun son bo'lishi kerak" })
  @Min(1, { message: "Summa musbat bo'lishi kerak" })
  @Max(MAX_AMOUNT)
  amount: number;

  @ApiPropertyOptional({
    example: '2026-10-21',
    description:
      "To'lov sanasi (YYYY-MM-DD). Berilmasa — bugun. Kelajakdagi va o'quvchi qo'shilishidan oldingi sana qabul qilinmaydi.",
  })
  @IsOptional()
  @IsDateOnly()
  paidAt?: string;
}

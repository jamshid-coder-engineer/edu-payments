import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { IsDateOnly } from '../../common/is-date-only.validator';
import { MAX_AMOUNT } from '../../common/limits';
import { NormalizePhone, Trim } from '../../common/transforms';

export class CreateStudentDto {
  @ApiProperty({ example: 'Aliyev Vali' })
  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'Ism majburiy' })
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: '+998901234567',
    description:
      "+998XXXXXXXXX formatida (bo'shliq va chiziqchalar olib tashlanadi)",
  })
  @NormalizePhone()
  @IsString()
  @Matches(/^\+998\d{9}$/, {
    message: "Telefon +998XXXXXXXXX formatida bo'lishi kerak",
  })
  phone: string;

  @ApiProperty({ example: 'Frontend-1' })
  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'Guruh majburiy' })
  @MaxLength(50)
  group: string;

  @ApiProperty({
    example: 500000,
    description: "Oylik to'lov summasi, so'mda (butun son)",
  })
  @IsInt({ message: "Oylik to'lov butun son bo'lishi kerak" })
  @Min(1, { message: "Oylik to'lov musbat bo'lishi kerak" })
  @Max(MAX_AMOUNT)
  monthlyFee: number;

  @ApiPropertyOptional({
    example: '2026-09-01',
    description: "O'qishni boshlagan sana (YYYY-MM-DD). Berilmasa — bugun.",
  })
  @IsOptional()
  @IsDateOnly()
  joinedAt?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { MONTH_REGEX } from '../../common/date.util';

export class DebtorsQueryDto {
  @ApiProperty({ example: '2026-10', description: 'Oy, YYYY-MM formatida' })
  @Matches(MONTH_REGEX, {
    message: "month YYYY-MM formatida bo'lishi kerak (masalan 2026-10)",
  })
  month: string;
}

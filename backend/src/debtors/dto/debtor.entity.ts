import { ApiProperty } from '@nestjs/swagger';

/** Swagger uchun javob namunasi. */
export class DebtorEntity {
  @ApiProperty({ example: 1 }) studentId: number;
  @ApiProperty({ example: 'Aliyev Vali' }) name: string;
  @ApiProperty({ example: '+998901234567' }) phone: string;
  @ApiProperty({ example: 'Frontend-1' }) group: string;
  @ApiProperty({ example: 500000 }) monthlyFee: number;
  @ApiProperty({ example: 300000, description: "Shu oyda to'langan" })
  paid: number;
  @ApiProperty({ example: 200000, description: 'Qarz' }) debt: number;
}

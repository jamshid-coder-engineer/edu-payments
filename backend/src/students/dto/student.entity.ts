import { ApiProperty } from '@nestjs/swagger';

/** Swagger uchun javob namunasi. */
export class StudentEntity {
  @ApiProperty({ example: 1 }) id: number;
  @ApiProperty({ example: 'Aliyev Vali' }) name: string;
  @ApiProperty({ example: '+998901234567' }) phone: string;
  @ApiProperty({ example: 'Frontend-1' }) group: string;
  @ApiProperty({ example: 500000 }) monthlyFee: number;
  @ApiProperty({ example: '2026-09-01' }) joinedAt: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

import { ApiProperty } from '@nestjs/swagger';

/** Swagger uchun javob namunasi. */
export class PaymentEntity {
  @ApiProperty({ example: 1 }) id: number;
  @ApiProperty({ example: 1 }) studentId: number;
  @ApiProperty({ example: 300000 }) amount: number;
  @ApiProperty({ example: '2026-10-21' }) paidAt: string;
  @ApiProperty() createdAt: Date;
}

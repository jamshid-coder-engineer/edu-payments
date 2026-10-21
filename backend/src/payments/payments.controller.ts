import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParseIdPipe } from '../common/parse-id.pipe';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentEntity } from './dto/payment.entity';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller()
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('payments')
  @ApiOperation({ summary: "To'lov qo'shish" })
  @ApiCreatedResponse({ type: PaymentEntity })
  @ApiBadRequestResponse({ description: 'Validatsiya xatosi' })
  @ApiNotFoundResponse({ description: "O'quvchi topilmadi" })
  create(@Body() dto: CreatePaymentDto) {
    return this.payments.create(dto);
  }

  @Get('students/:id/payments')
  @ApiOperation({ summary: "O'quvchi to'lovlari tarixi" })
  @ApiOkResponse({ type: [PaymentEntity] })
  @ApiNotFoundResponse({ description: "O'quvchi topilmadi" })
  findByStudent(@Param('id', ParseIdPipe) id: number) {
    return this.payments.findByStudent(id);
  }
}

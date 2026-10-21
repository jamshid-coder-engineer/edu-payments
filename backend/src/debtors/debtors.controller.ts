import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DebtorsService } from './debtors.service';
import { DebtorEntity } from './dto/debtor.entity';
import { DebtorsQueryDto } from './dto/debtors-query.dto';

@ApiTags('debtors')
@Controller('debtors')
export class DebtorsController {
  constructor(private readonly debtors: DebtorsService) {}

  @Get()
  @ApiOperation({
    summary: 'Tanlangan oy qarzdorlari',
    description:
      "Faqat qarzi bor o'quvchilar: debt = max(0, monthlyFee - shu oydagi to'lovlar).",
  })
  @ApiOkResponse({ type: [DebtorEntity] })
  @ApiBadRequestResponse({ description: "month noto'g'ri yoki berilmagan" })
  findByMonth(@Query() query: DebtorsQueryDto) {
    return this.debtors.findByMonth(query.month);
  }
}

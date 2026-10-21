import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { MAX_ID } from './limits';

/**
 * URL'dagi :id ni tekshiradi: faqat 1..MAX_ID oralig'idagi butun son.
 * Juda katta son bazaga yetib borib 500 xatoga sabab bo'lmasligi uchun kerak.
 */
@Injectable()
export class ParseIdPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const id = Number(value);
    if (!/^\d+$/.test(value) || id < 1 || id > MAX_ID) {
      throw new BadRequestException("id musbat butun son bo'lishi kerak");
    }
    return id;
  }
}

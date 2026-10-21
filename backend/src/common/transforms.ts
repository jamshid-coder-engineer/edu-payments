import { Transform } from 'class-transformer';

/** Matn boshidagi va oxiridagi bo'shliqlarni olib tashlaydi. */
export const Trim = () =>
  Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  );

/** "+998 90 123-45-67" kabi yozuvni "+998901234567" ga keltiradi. */
export const NormalizePhone = () =>
  Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.replace(/[\s\-()]/g, '') : value,
  );

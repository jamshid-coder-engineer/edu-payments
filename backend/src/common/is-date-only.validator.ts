import { ValidationOptions, ValidateBy, buildMessage } from 'class-validator';
import { isValidDate } from './date.util';

/** Qiymat mavjud kalendar sanasi va "YYYY-MM-DD" formatida ekanini tekshiradi. */
export function IsDateOnly(options?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: 'isDateOnly',
      validator: {
        validate: (value) => isValidDate(value),
        defaultMessage: buildMessage(
          (each) =>
            `${each}$property YYYY-MM-DD formatidagi mavjud sana bo'lishi kerak`,
          options,
        ),
      },
    },
    options,
  );
}

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { AmountInput } from '@/components/amount-input';
import { ErrorMessages } from '@/components/error-messages';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { StudentPicker } from '@/features/students/student-picker';
import { useStudents } from '@/features/students/use-students';
import { ApiError } from '@/lib/api-client';
import { formatDate, todayIso } from '@/lib/date';
import { groupDigits, parseAmount } from '@/lib/money';
import type { Payment } from '@/types/api';
import { paymentFormSchema, type PaymentFormValues } from './payment-schema';
import { useCreatePayment } from './use-create-payment';

export interface PaymentFormDefaults {
  studentId?: number;
  amount?: number;
  paidAt: string;
}

interface PaymentFormProps {
  defaults: PaymentFormDefaults;
  onSuccess: (payment: Payment) => void;
}

export function PaymentForm({ defaults, onSuccess }: PaymentFormProps) {
  const students = useStudents();
  const createPayment = useCreatePayment();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      studentId: defaults.studentId,
      amount: defaults.amount ? groupDigits(defaults.amount) : '',
      paidAt: defaults.paidAt,
    },
  });

  const studentId = useWatch({ control: form.control, name: 'studentId' });
  const joinedAt = students.data?.find((s) => s.id === studentId)?.joinedAt;

  const onSubmit = form.handleSubmit((values) =>
    createPayment.mutate(
      {
        studentId: values.studentId,
        amount: parseAmount(values.amount),
        paidAt: values.paidAt,
      },
      { onSuccess },
    ),
  );

  const serverErrors =
    createPayment.error instanceof ApiError ? createPayment.error.messages : [];

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <Controller
          name="studentId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="payment-student">O'quvchi</FieldLabel>
              <StudentPicker
                id="payment-student"
                students={students.data ?? []}
                value={field.value}
                onChange={field.onChange}
                invalid={fieldState.invalid}
                disabled={students.isPending}
              />
              {students.isError && (
                <FieldError>O'quvchilar ro'yxati yuklanmadi</FieldError>
              )}
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="amount"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="payment-amount">Summa, so'm</FieldLabel>
              <AmountInput
                {...field}
                id="payment-amount"
                placeholder="500 000"
                className="h-11 text-base"
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="paidAt"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="payment-date">To'lov sanasi</FieldLabel>
              <Input
                {...field}
                id="payment-date"
                type="date"
                min={joinedAt}
                max={todayIso()}
                className="h-11 text-base"
                aria-invalid={fieldState.invalid}
              />
              <FieldDescription>
                To'lov sanasi qaysi oyga tushsa, o'sha oy hisobiga yoziladi.
                {joinedAt &&
                  ` O'quvchi ${formatDate(joinedAt)} dan beri o'qiydi.`}
              </FieldDescription>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <ErrorMessages messages={serverErrors} />

        <Button
          type="submit"
          size="lg"
          className="h-11 w-full"
          disabled={createPayment.isPending}
        >
          {createPayment.isPending && <Loader2Icon className="animate-spin" />}
          To'lovni saqlash
        </Button>
      </FieldGroup>
    </form>
  );
}

import { Input } from '@/components/ui/input';
import { groupDigits } from '@/lib/money';

type AmountInputProps = Omit<React.ComponentProps<typeof Input>, 'onChange'> & {
  onChange: (value: string) => void;
};

/** Summa maydoni: yozish jarayonida raqamlar guruhlanadi (1250000 -> "1 250 000"). */
export function AmountInput({ onChange, ...props }: AmountInputProps) {
  return (
    <Input
      {...props}
      inputMode="numeric"
      autoComplete="off"
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, '');
        onChange(digits ? groupDigits(Number(digits)) : '');
      }}
    />
  );
}

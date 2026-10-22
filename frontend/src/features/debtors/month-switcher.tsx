import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { currentMonth, formatMonth, shiftMonth } from '@/lib/date';

interface MonthSwitcherProps {
  month: string;
  onChange: (month: string) => void;
}

/** Oy tanlash: oldingi/keyingi tugmalar va kalendar. Kelajak oylar yopiq. */
export function MonthSwitcher({ month, onChange }: MonthSwitcherProps) {
  const latest = currentMonth();
  const isLatest = month >= latest;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="size-11 bg-card shadow-xs"
        aria-label="Oldingi oy"
        onClick={() => onChange(shiftMonth(month, -1))}
      >
        <ChevronLeftIcon />
      </Button>

      <label className="relative flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border bg-card text-base font-medium shadow-xs transition-colors focus-within:ring-3 focus-within:ring-ring/50 hover:bg-muted">
        <CalendarDaysIcon className="size-4 text-muted-foreground" />
        {formatMonth(month)}
        {/* Ko'rinmas kalendar: bosilganda telefonning oy tanlagichi ochiladi */}
        <input
          type="month"
          aria-label="Oyni tanlash"
          value={month}
          max={latest}
          onChange={(e) => e.target.value && onChange(e.target.value)}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </label>

      <Button
        variant="outline"
        size="icon"
        className="size-11 bg-card shadow-xs"
        aria-label="Keyingi oy"
        disabled={isLatest}
        onClick={() => onChange(shiftMonth(month, 1))}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
}

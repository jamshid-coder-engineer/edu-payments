import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { Student } from '@/types/api';

interface StudentPickerProps {
  id?: string;
  students: Student[];
  value?: number;
  onChange: (studentId: number) => void;
  invalid?: boolean;
  disabled?: boolean;
}

/** Ism, guruh yoki telefon bo'yicha qidirib o'quvchi tanlash. */
export function StudentPicker({
  id,
  students,
  value,
  onChange,
  invalid,
  disabled,
}: StudentPickerProps) {
  const [open, setOpen] = useState(false);
  const selected = students.find((s) => s.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid}
          disabled={disabled}
          className="h-11 w-full justify-between font-normal"
        >
          <span
            className={cn('truncate', !selected && 'text-muted-foreground')}
          >
            {selected
              ? `${selected.name} · ${selected.group}`
              : "O'quvchini tanlang"}
          </span>
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Ism, guruh yoki telefon..." />
          <CommandList>
            <CommandEmpty>O'quvchi topilmadi</CommandEmpty>
            <CommandGroup>
              {students.map((student) => (
                <CommandItem
                  key={student.id}
                  value={`${student.name} ${student.group} ${student.phone}`}
                  onSelect={() => {
                    onChange(student.id);
                    setOpen(false);
                  }}
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate">{student.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {student.group}
                    </span>
                  </div>
                  <CheckIcon
                    className={cn(
                      'ml-auto',
                      student.id === value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

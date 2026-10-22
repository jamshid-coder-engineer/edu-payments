import { colorFor, initials } from '@/lib/avatar';
import { cn } from '@/lib/utils';

interface InitialsAvatarProps {
  name: string;
  colorKey: number;
  className?: string;
}

export function InitialsAvatar({
  name,
  colorKey,
  className,
}: InitialsAvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
        colorFor(colorKey),
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

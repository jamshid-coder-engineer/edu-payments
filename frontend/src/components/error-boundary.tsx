import { AlertTriangleIcon, RotateCwIcon } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Kutilmagan xatoda oq ekran o'rniga tushunarli xabar va qayta yuklash tugmasi.
 * Backend xatolari bu yerga kelmaydi: ular ro'yxat va formaning o'zida ko'rsatiladi.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        role="alert"
        className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-3 px-4 text-center"
      >
        <AlertTriangleIcon className="size-10 text-destructive" />
        <h1 className="text-lg font-semibold">Kutilmagan xatolik yuz berdi</h1>
        <p className="text-sm text-muted-foreground">
          Sahifani qayta yuklang. Xato takrorlansa, administratorga xabar
          bering.
        </p>
        <Button onClick={() => window.location.reload()}>
          <RotateCwIcon />
          Qayta yuklash
        </Button>
      </div>
    );
  }
}

import { AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

/** Backend qaytargan xato xabarlari ro'yxati. Bo'sh bo'lsa hech narsa chizilmaydi. */
export function ErrorMessages({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null;

  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertDescription>
        {messages.map((message) => (
          <p key={message}>{message}</p>
        ))}
      </AlertDescription>
    </Alert>
  );
}

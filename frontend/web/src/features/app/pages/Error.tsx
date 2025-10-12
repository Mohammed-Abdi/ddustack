import { ErrorIcon, Outage } from '@/assets/icons/Error';
import { Button } from '@/components/ui';
import type React from 'react';

interface ErrorProps {
  message?: {
    main: string;
    sub?: string;
  };
  retry?: () => void;
  full?: boolean;
}

export const Error: React.FC<ErrorProps> = ({
  message,
  retry,
  full = true,
}) => {
  const handleRetry = () => retry?.();

  return (
    <main
      role="status"
      className="flex items-center justify-center p-5"
      style={{
        height: full ? '100dvh' : '85dvh',
      }}
    >
      <div className="flex flex-col items-center justify-center gap-5">
        {message ? (
          <ErrorIcon className="w-20 h-20 opacity-80" />
        ) : (
          <Outage className="w-20 h-20 opacity-80" />
        )}

        <span aria-live="polite" className="text-center max-w-90">
          {message ? (
            <article>
              <p>{message.main}!</p>
              {message.sub && (
                <p className="text-sm text-[var(--color-text-muted)]">
                  {message.sub}
                </p>
              )}
            </article>
          ) : (
            'Connection failed. Please try again!'
          )}
        </span>

        {!message && retry && (
          <Button variant="outline" onClick={handleRetry}>
            Retry
          </Button>
        )}
      </div>
    </main>
  );
};

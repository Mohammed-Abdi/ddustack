import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { Button } from './Button';

interface DetailProps extends React.HTMLAttributes<HTMLElement> {
  label?: string;
  value: string | null | undefined;
  copyable?: boolean;
  tooltipMessage?: string;
  truncate?: boolean;
}

export const Detail: React.FC<DetailProps> = ({
  label,
  value,
  copyable,
  truncate = true,
  className,
  tooltipMessage,
  ...props
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        toast.success('Copied to clipboard');
        setTimeout(() => setCopied(false), 1500);
      } catch {
        toast.error('Failed to copy');
      }
    },
    [value]
  );

  return (
    <div
      className={cn('flex items-center justify-between gap-2', className)}
      {...props}
    >
      <article className="flex-1 min-w-0">
        <label className="text-xs text-(--color-text-muted)">{label}</label>
        <div className="flex items-center gap-1 truncate">
          <p className={cn('truncate', truncate && 'truncate')}>
            {value || '—'}
          </p>
          {copyable && value && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="icon"
                  style={{ background: 'transparent' }}
                  onClick={handleCopy}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltipMessage || `Copy ${label} to clipboard`}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </article>
    </div>
  );
};

import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import * as React from 'react';

interface ItemProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  disable?: boolean;
}

export const Item: React.FC<ItemProps> = ({
  children,
  className,
  isLoading = false,
  disable = false,
  ...props
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
      className={cn(
        'flex flex-col gap-5 p-5 min-h-44 h-fit rounded-lg bg-[var(--color-surface)] transition-colors duration-300 ease-in-out outline outline-[var(--color-border)] relative',
        disable
          ? 'cursor-no-drop'
          : 'cursor-pointer hover:bg-[var(--color-surface-hover)]',
        className
      )}
    >
      {children}

      {!isLoading && !disable && (
        <ChevronRight
          className={cn(
            'absolute top-5 transition-all duration-300 ease-in-out',
            isHovered ? 'right-5 opacity-100' : 'right-6 opacity-50'
          )}
        />
      )}
    </div>
  );
};

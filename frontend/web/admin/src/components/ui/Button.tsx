import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import * as React from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'outline' | 'link' | 'ghost' | 'destructive' | 'icon';
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  type = 'button',
  disabled,
  ...props
}) => {
  const baseClasses =
    'rounded-full font-medium transition-colors duration-300 ease-in-out cursor-pointer disabled:cursor-default disabled:opacity-50';

  const variantClasses = cn({
    'px-4 py-2 text-sm bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] disabled:hover:bg-[var(--color-primary)]':
      variant === 'primary',
    'px-4 py-2 text-sm outline-[1.5px] outline-[var(--color-border)] hover:bg-[var(--color-container)] disabled:hover:bg-transparent disabled:text-[var(--color-text-muted)]':
      variant === 'outline',
    'px-4 py-2 text-blue-600 hover:underline hover:text-blue-700 disabled:hover:text-blue-300 disabled:text-blue-300':
      variant === 'link',
    'px-4 py-2 text-sm bg-transparent outline-none disabled:hover:bg-transparent disabled:text-[var(--color-text-muted)]':
      variant === 'ghost',
    'px-4 py-2 text-sm outline-none bg-red-600 text-white hover:bg-red-700 disabled:hover:bg-red-400 disabled:bg-red-400':
      variant === 'destructive',
    'w-10 h-10 outline-none hover:bg-[var(--color-container)] disabled:hover:bg-[var(--color-border)] disabled:bg-[var(--color-border)]':
      variant === 'icon',
  });

  return (
    <button
      type={type}
      className={cn(baseClasses, variantClasses, className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

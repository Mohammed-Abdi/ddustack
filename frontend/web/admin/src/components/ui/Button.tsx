import { cn } from '@/lib/utils';
import type React from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

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
  ...props
}) => {
  const baseClasses =
    'rounded-full font-medium transition-color duration-300 ease-in-out cursor-pointer';

  const variantClasses = cn({
    'px-4 py-2 text-sm bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]':
      variant === 'primary',
    'px-4 py-2 text-sm outline-[1.5px] outline-[var(--color-border)] hover:bg-[var(--color-container)]':
      variant === 'outline',
    'px-4 py-2 text-blue-600 hover:underline hover:text-blue-700':
      variant === 'link',
    'px-4 py-2 text-sm bg-transparent outline-none': variant === 'ghost',
    'px-4 py-2 text-sm outline-none bg-red-600 text-white hover:bg-red-700':
      variant === 'destructive',
    'w-10 h-10 outline-none hover:bg-[var(--color-container)]':
      variant === 'icon',
  });

  return (
    <button
      type={type}
      className={cn(baseClasses, variantClasses, className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

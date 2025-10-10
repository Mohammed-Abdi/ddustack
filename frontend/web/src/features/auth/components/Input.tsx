import Button from '@/components/ui/Button';
import { Eye, EyeClosed } from 'lucide-react';
import * as React from 'react';

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, value, onChange, className = '', ...props }, ref) => {
    const isPassword = [
      'password',
      'confirm password',
      'confirmpassword',
    ].includes(label.toLowerCase());
    const [hidden, setHidden] = React.useState<boolean>(isPassword);

    return (
      <div className={`relative w-full ${className}`}>
        <input
          ref={ref}
          type={isPassword ? (hidden ? 'password' : 'text') : 'text'}
          {...props}
          value={value}
          onChange={onChange}
          placeholder=" "
          className={`
            peer block w-full border rounded-full py-3 ${
              isPassword ? 'pl-6 pr-12' : 'px-6'
            } text-[15px] 
            focus:outline-none focus:border-[var(--color-info)]
            border-[var(--color-border)]
          `}
        />
        <label
          className={`
            absolute left-6 top-1/2 -translate-y-1/2 text-[15px] text-[var(--color-text-muted)] px-0.5 bg-[var(--color-background)] rounded-xs text-base transition-all 
            pointer-events-none
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[var(--color-text-muted)]
            peer-focus:-top-[0.5px] peer-focus:text-[var(--color-info)] peer-focus:text-sm
            peer-not-placeholder-shown:-top-[0.5px] peer-not-placeholder-shown:text-sm
          `}
        >
          {label}
        </label>
        {isPassword && (
          <Button
            variant="icon"
            onClick={() => setHidden((cur) => !cur)}
            className="flex items-center justify-center absolute top-1/2 -translate-y-1/2 right-2.5 opacity-70"
            style={{ background: 'transparent' }}
          >
            {value ? (
              hidden ? (
                <EyeClosed className="w-4.5 h-4.5" />
              ) : (
                <Eye className="w-4.5 h-4.5" />
              )
            ) : null}
          </Button>
        )}
      </div>
    );
  }
);

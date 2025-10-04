import type { SVGProps } from 'react';
import * as React from 'react';
import { Apple, Github, Google } from './OAuthIcons';

export type OAuthProvider = 'google' | 'github' | 'apple';

interface OAuthButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  provider: OAuthProvider;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const providerConfig: Record<
  OAuthProvider,
  { label: string; Icon: React.FC<SVGProps<SVGSVGElement>> }
> = {
  google: { label: 'Continue with Google', Icon: Google },
  github: { label: 'Continue with GitHub', Icon: Github },
  apple: { label: 'Continue with Apple', Icon: Apple },
};

const OAuthButton: React.FC<OAuthButtonProps> = ({
  provider,
  onClick,
  className = '',
  disabled = false,
  ...props
}) => {
  const { label, Icon } = providerConfig[provider];

  return (
    <button
      {...props}
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-[var(--color-border)]
        bg-[var(--color-background)] text-[var(--color-text-primary)] 
        transition-colors
        ${
          disabled
            ? 'opacity-50'
            : 'cursor-pointer hover:bg-[var(--color-surface)]'
        }
        ${className}
      `}
    >
      <Icon />
      {label}
    </button>
  );
};

export default OAuthButton;

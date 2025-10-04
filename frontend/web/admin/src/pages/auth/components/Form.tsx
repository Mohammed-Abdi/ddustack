import { Spinner } from '@/assets/animations/Spinner';
import { Identification } from '@/assets/icons/Identification';
import { LogoColored } from '@/assets/icons/Logo';
import { Password } from '@/assets/icons/Password';
import Button from '@/components/ui/Button';
import type { ApiError } from '@/features/api/interfaces';
import * as React from 'react';
import { toast } from 'sonner';
import EmailBadge from './EmailBadge';
import Input from './Input';
import OAuthButton, { type OAuthProvider } from './OAuthButton';

const authMethods = [
  {
    provider: 'google',
    method: async () => {
      try {
        //TODO: implement google auth logic
        alert('Google auth (on dev)');
      } catch (error: unknown) {
        const err = error as ApiError;
        toast.error(err.data?.detail);
      }
    },
  },
  {
    provider: 'github',
    method: async () => {
      try {
        //TODO: implement google auth logic
        alert('Github auth (on dev)');
      } catch (error: unknown) {
        const err = error as ApiError;
        toast.error(err.data?.detail);
      }
    },
  },
  {
    provider: 'apple',
    method: async () => {
      try {
        //TODO: implement google auth logic
        alert('Apple auth (on dev)');
      } catch (error: unknown) {
        const err = error as ApiError;
        toast.error(err.data?.detail);
      }
    },
  },
];

const Form: React.FC = () => {
  const [firstName, setFirstName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string>('');
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [emailSubmitted, setEmailSubmitted] = React.useState<boolean>(false);
  const [userExists, setUserExists] = React.useState<boolean | null>(null);

  // TODO: Replace with real loading state
  const isLoading = false;

  const isLogin = emailSubmitted && userExists;
  const isSignup = emailSubmitted && !userExists;

  const emailRef = React.useRef<HTMLInputElement | null>(null);
  const passwordRef = React.useRef<HTMLInputElement | null>(null);
  const firstNameRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!emailSubmitted && emailRef.current) emailRef.current.focus();
    if (isLogin && passwordRef.current) passwordRef.current.focus();
    if (isSignup && firstNameRef.current) firstNameRef.current.focus();
  }, [emailSubmitted, isLogin, isSignup]);

  const handleSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    try {
      //TODO: implement email auth logic
      setEmailSubmitted(true);
      setUserExists(true);
    } catch (error: unknown) {
      const err = error as ApiError;
      toast.error(err.data?.detail);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      //TODO: implement email login logic
      alert('Email login (on dev)');
    } catch (error: unknown) {
      const err = error as ApiError;
      toast.error(err.data?.detail);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      //TODO: implement email signup logic
      alert('Email signup (on dev)');
    } catch (error: unknown) {
      const err = error as ApiError;
      toast.error(err.data?.detail);
    }
  };

  return (
    <form
      className="flex flex-col gap-5 w-full"
      onSubmit={
        !emailSubmitted
          ? handleSubmitEmail
          : isLogin
          ? handleEmailLogin
          : handleEmailSignup
      }
    >
      <header className="flex flex-col gap-2.5 items-center text-center">
        {!emailSubmitted && <LogoColored className="w-8 h-8" />}
        {isLogin && <Password className="w-10 h-10" />}
        {isSignup && <Identification className="w-10 h-10" />}

        {!emailSubmitted && (
          <h1 className="text-xl font-medium">Log in or Sign up</h1>
        )}
        {isLogin && (
          <h1 className="text-xl font-medium">Enter your password</h1>
        )}

        {isSignup && (
          <h1 className="text-xl font-medium">Let's create your account</h1>
        )}

        {!emailSubmitted && (
          <p className="text-sm text-[var(--color-text-muted)]">
            You will get everything you need for campus life.
          </p>
        )}
      </header>

      {!emailSubmitted && (
        <>
          {authMethods.map((auth) => (
            <OAuthButton
              provider={auth.provider as OAuthProvider}
              onClick={auth.method}
              disabled={isLoading}
            />
          ))}

          <div className="flex items-center">
            <hr className="flex-grow border-t border-[var(--color-border)]" />
            <span className="mx-2 text-[var(--color-text-muted)] text-sm font-medium">
              OR
            </span>
            <hr className="flex-grow border-t border-[var(--color-border)]" />
          </div>

          <Input
            disabled={isLoading}
            ref={emailRef}
            required
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            disabled={isLoading}
            className="text-[15px] py-3"
            type="submit"
          >
            {isLoading ? (
              <div className="flex items-center gap-2 w-fit mx-auto">
                <Spinner className="w-4 h-4" />
                <span>Verifying email...</span>
              </div>
            ) : (
              'Continue'
            )}
          </Button>
        </>
      )}

      {isLogin && (
        <>
          <EmailBadge email={email} />
          <Input
            disabled={isLoading}
            ref={passwordRef}
            required
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            disabled={isLoading}
            className="text-[15px] py-3"
            type="submit"
            onClick={() => setEmailSubmitted(true)}
          >
            {isLoading ? (
              <div className="flex items-center gap-2 w-fit mx-auto">
                <Spinner className="w-4 h-4" />
                <span>Logging in...</span>
              </div>
            ) : (
              'Log in'
            )}
          </Button>
        </>
      )}

      {isSignup && (
        <>
          <article className="flex items-center gap-2.5">
            <Input
              disabled={isLoading}
              ref={firstNameRef}
              required
              label="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              disabled={isLoading}
              required
              label="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </article>

          <Input
            disabled={isLoading}
            required
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            disabled={isLoading}
            required
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            disabled={isLoading}
            required
            label="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            disabled={isLoading}
            className="text-[15px] py-3"
            type="submit"
            onClick={() => setEmailSubmitted(true)}
          >
            {isLoading ? (
              <div className="flex items-center gap-2 w-fit mx-auto">
                <Spinner className="w-4 h-4" />
                <span>Signing up...</span>
              </div>
            ) : (
              'Sign up'
            )}
          </Button>
        </>
      )}
    </form>
  );
};

export default Form;

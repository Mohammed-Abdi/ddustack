import { useOauthLoginMutation } from '@/features/auth/authApi';
import { setCredentials } from '@/features/auth/authSlice';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import Error from '../status/Error';
import Loader from '../status/Loader';
import type { OAuthProvider } from './components/OAuthButton';

const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { provider } = useParams<{ provider: string }>();
  const code = searchParams.get('code') || undefined;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [oauthLogin, { isLoading, error }] = useOauthLoginMutation();

  const [codeSent, setCodeSent] = React.useState(false);
  const loginTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  React.useEffect(() => {
    if (!provider || !code || codeSent) return;

    setCodeSent(true);

    loginTimerRef.current = setTimeout(() => {
      toast.error('Request timed out. Please try again.');
      navigate('/auth');
    }, 10000);

    oauthLogin({ provider: provider as OAuthProvider, code })
      .unwrap()
      .then((res) => {
        if (loginTimerRef.current) clearTimeout(loginTimerRef.current);
        dispatch(
          setCredentials({ accessToken: res.access_token, user: res.user })
        );
        navigate('/');
      })
      .catch((err) => {
        if (loginTimerRef.current) clearTimeout(loginTimerRef.current);
        console.error('OAuth login failed:', err);
        navigate('/auth');
      });

    return () => {
      if (loginTimerRef.current) clearTimeout(loginTimerRef.current);
    };
  }, [provider, code, codeSent, dispatch, oauthLogin, navigate]);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Error
          message={{
            main: 'Login failed',
            sub: 'Please try again or use another method',
          }}
        />
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default OAuthCallback;

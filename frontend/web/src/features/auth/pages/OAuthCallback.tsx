import { Loader } from '@/features/app';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useLazyMeQuery, useOauthLoginMutation } from '../api/authApi';
import type { OAuthProvider } from '../components/OAuthButton';
import { setAccess, setUser } from '../slices/authSlice';

export const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { provider } = useParams<{ provider: string }>();
  const code = searchParams.get('code') || undefined;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [oauthLogin, { isLoading: isLoggingIn }] = useOauthLoginMutation();
  const [fetchProfile, { isLoading: isFetchingProfile }] = useLazyMeQuery();

  const [codeSent, setCodeSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const isLoading = isLoggingIn || isFetchingProfile || loading;

  React.useEffect(() => {
    if (!provider || !code || codeSent) return;

    const handleOAuthLogin = async () => {
      setCodeSent(true);
      setLoading(true);

      const timer = setTimeout(() => {
        toast.error('OAuth request timed out. Please try again.');
        setLoading(false);
        navigate('/auth');
      }, 10000);

      try {
        const data = await oauthLogin({
          provider: provider as OAuthProvider,
          code,
        }).unwrap();

        dispatch(setAccess(data.access_token));

        const profile = await fetchProfile().unwrap();
        dispatch(setUser(profile));

        clearTimeout(timer);
        setLoading(false);

        navigate('/');
      } catch {
        clearTimeout(timer);
        toast.error(
          'OAuth login failed. Please try again or use another method.'
        );
        setLoading(false);
        navigate('/auth');
      }
    };

    handleOAuthLogin();

    return () => {
      setLoading(false);
    };
  }, [provider, code, codeSent, dispatch, oauthLogin, navigate, fetchProfile]);

  return isLoading && <Loader />;
};

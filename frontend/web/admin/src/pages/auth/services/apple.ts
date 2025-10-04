const APPLE_CLIENT_ID = import.meta.env.VITE_APPLE_CLIENT_ID;
const APPLE_REDIRECT_URI = import.meta.env.VITE_APPLE_REDIRECT_URI;

export const handleAppleAuth = () => {
  const url = new URL('https://appleid.apple.com/auth/authorize');
  url.searchParams.set('client_id', APPLE_CLIENT_ID);
  url.searchParams.set('redirect_uri', APPLE_REDIRECT_URI);
  url.searchParams.set('response_type', 'code id_token');
  url.searchParams.set('scope', 'name email');
  url.searchParams.set('response_mode', 'form_post');

  window.location.href = url.toString();
};

import { useEffect, useState } from 'react';

type Device = 'phone' | 'mobile' | 'tablet' | 'desktop';

export function useMediaQuery(device: Device): boolean {
  let query: string;

  switch (device) {
    case 'phone':
      query = '(max-width: 500px)';
      break;
    case 'mobile':
      query = '(max-width: 768px)';
      break;
    case 'tablet':
      query = '(min-width: 501px) and (max-width: 1024px)';
      break;
    case 'desktop':
      query = '(min-width: 1025px)';
      break;
    default:
      query = '(min-width: 0px)';
  }

  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

import { useEffect } from 'react';

export function useScrollReset() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
}

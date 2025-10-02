import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToHash: React.FC = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  return null;
};

export default ScrollToHash;

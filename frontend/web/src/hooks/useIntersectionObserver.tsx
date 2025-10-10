import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
  once?: boolean;
  threshold?: number;
}

export function useIntersectionObserver<
  T extends HTMLElement = HTMLDivElement
>({ once = true, threshold = 0.2 }: UseIntersectionObserverProps = {}) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animateOnce, setAnimateOnce] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);

        if (entry.isIntersecting && once) {
          setAnimateOnce(true);
        } else if (!once) {
          setAnimateOnce(entry.isIntersecting);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, once]);

  return { ref, isVisible, animateOnce };
}

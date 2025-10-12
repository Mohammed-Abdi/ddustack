import { useMediaQuery } from '@/hooks';
import { AnimatePresence, motion } from 'framer-motion';
import { Command, Search } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  shortcutKey?: string;
  isMobileClosedByDefault?: boolean;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  shortcutKey = 'K',
  isMobileClosedByDefault = true,
  className = '',
}) => {
  const isMobile = useMediaQuery('mobile');
  const [isVisible, setIsVisible] = useState<boolean>(
    () => !isMobile || !isMobileClosedByDefault
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  const fade = useMemo(
    () => ({
      out: isMobile ? { scale: 0, opacity: 0 } : {},
      in: isMobile ? { scale: 1, opacity: 1 } : {},
    }),
    [isMobile]
  );

  useEffect(() => {
    if (isVisible) inputRef.current?.focus();
  }, [isVisible]);

  useEffect(() => {
    const handleHotKey = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === shortcutKey.toLowerCase()
      ) {
        e.preventDefault();
        setIsVisible(true);
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleHotKey);
    return () => window.removeEventListener('keydown', handleHotKey);
  }, [shortcutKey]);

  const containerClasses = useMemo(() => {
    const base = `flex gap-1 items-stretch outline outline-[var(--color-border)] h-10 text-sm rounded-full bg-[var(--color-background)] transition-all duration-300 ease-in-out overflow-hidden ${className}`;
    if (!isMobile) return `${base} w-50 cursor-text px-2.5 md:justify-between`;
    return isVisible
      ? `${base} w-50 cursor-text px-2.5 md:justify-between`
      : `${base} w-10 justify-center cursor-pointer`;
  }, [isMobile, isVisible, className]);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!isMobile) return;
    e.stopPropagation();
    setIsVisible((prev) => !prev);
    if (!isVisible) inputRef.current?.focus();
  };

  return (
    <div onClick={handleClick} className={containerClasses}>
      <div
        className={
          isVisible || !isMobile ? 'mr-1.5 md:mr-1 my-auto' : 'my-auto'
        }
      >
        <Search className="w-5 h-5" />
      </div>

      <AnimatePresence>
        {(isVisible || !isMobile) && (
          <>
            <motion.input
              key="SearchInputField"
              initial={fade.out}
              animate={fade.in}
              exit={fade.out}
              transition={{ ease: 'easeInOut', duration: 0.15 }}
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="bg-[var(--color-bg-secondary)] outline-0 w-full"
              placeholder={placeholder}
            />

            {!isMobile && (
              <motion.div
                key="SearchInputShortcut"
                initial={fade.out}
                animate={fade.in}
                exit={fade.out}
                transition={{ ease: 'easeInOut', duration: 0.15 }}
                className="flex items-center gap-0.5 text-xs font-medium opacity-70"
              >
                <Command className="w-4 h-4" /> <span>{shortcutKey}</span>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

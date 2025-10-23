import { Enter } from '@/assets/icons/KeyBoard';
import { Button } from '@/components/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  setQuery: (value: string) => void;
  debouncedQuery: string;
  setDebouncedQuery: (value: string) => void;
  results: { id: string | number; name: string }[];
  isFetching?: boolean;
  onSelect: (id: string | number) => void;
  icon?: React.ReactNode;
  placeholder?: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  query,
  setQuery,
  debouncedQuery,
  setDebouncedQuery,
  results,
  isFetching = false,
  onSelect,
  icon,
  placeholder = 'Search...',
}) => {
  const [focusIndex, setFocusIndex] = useState(-1);
  const listRefs = useRef<(HTMLDivElement | null)[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  // debounce query
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query, setDebouncedQuery]);

  // reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setDebouncedQuery('');
      setFocusIndex(-1);
    }
  }, [isOpen, setQuery, setDebouncedQuery]);

  // 🧠 Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (!results.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter' && focusIndex >= 0) {
        e.preventDefault();
        onSelect(results[focusIndex].id);
        onClose();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    },
    [focusIndex, results, onSelect, onClose, isOpen]
  );

  // attach global key listener only when modal is open
  useEffect(() => {
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // scroll into view on focus change
  useEffect(() => {
    if (focusIndex >= 0) {
      listRefs.current[focusIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [focusIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={modalRef}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="fixed inset-0 bg-black/30 flex justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="mt-[10vh] bg-(--color-background) overflow-hidden pb-2
                       rounded-2xl shadow-xl outline outline-[var(--color-border)] h-fit"
            style={{ width: 'min(600px, 100% - 40px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center relative">
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-7 pr-12 py-4 rounded-t-2xl bg-(--color-container)
                           text-[15px] outline-none border-b border-(--color-border)"
              />
              <Button
                variant="icon"
                className="absolute top-1/2 -translate-y-1/2 right-2.5"
                onClick={onClose}
              >
                <X className="w-4 h-4 opacity-70" />
              </Button>
            </div>

            <div className="max-h-80 overflow-y-auto px-4 py-2">
              {isFetching ? (
                <p className="text-sm opacity-60 p-2.5">Searching...</p>
              ) : results.length ? (
                results.map((item, index) => (
                  <div
                    key={item.id}
                    ref={(el) => {
                      listRefs.current[index] = el;
                    }}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer text-sm font-medium
                      ${
                        index === focusIndex
                          ? 'bg-(--color-container)'
                          : 'hover:bg-(--color-container)'
                      }`}
                    onMouseEnter={() => setFocusIndex(index)}
                    onClick={() => {
                      onSelect(item.id);
                      onClose();
                    }}
                  >
                    {icon && <span className="opacity-70">{icon}</span>}
                    <span className="truncate">{item.name}</span>
                    {index === focusIndex && (
                      <Enter className="ml-auto w-4 h-4 opacity-70" />
                    )}
                  </div>
                ))
              ) : debouncedQuery ? (
                <p className="text-sm opacity-60 p-2.5">No results</p>
              ) : (
                <p className="text-sm opacity-60 p-2.5">
                  Start typing to search...
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

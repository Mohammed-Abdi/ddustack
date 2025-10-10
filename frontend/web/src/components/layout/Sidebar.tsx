import { ChevronLeft } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LogoColored } from '@/assets/icons/Logo';
import SidebarIcon from '@/assets/icons/SidebarIcon';
import Button from '@/components/ui/Button';
import NavLink from '@/components/ui/NavLink';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { navLinks } from '@/data/navLinks';
import { closeSidebar, toggleSidebar } from '@/features/app/slices/appSlice';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { AppDispatch, RootState } from '@/store/store';

const Sidebar: React.FC = () => {
  const isMobile = useMediaQuery('mobile');
  const dispatch = useDispatch<AppDispatch>();
  const sidebar = useSelector((state: RootState) => state.app.sidebar);
  const navRef = useRef<HTMLElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        navRef.current &&
        !navRef.current.contains(event.target as Node) &&
        (!userMenuRef.current ||
          !userMenuRef.current.contains(event.target as Node))
      ) {
        dispatch(closeSidebar());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dispatch, isMobile]);

  return (
    <nav
      ref={navRef}
      className={`flex flex-col gap-5 p-2.5 h-[100dvh] overflow-y-auto
                  bg-[var(--color-surface)] outline outline-[var(--color-container)]
                  duration-300 ease-in-out z-30 overflow-x-hidden
                  ${
                    isMobile
                      ? 'fixed top-0 left-0 w-80 transition-transform shadow-sm'
                      : 'transition-width'
                  }
                  ${
                    isMobile && sidebar === 'close'
                      ? '-translate-x-full'
                      : 'translate-x-0'
                  }
                `}
      style={{
        width: isMobile ? '75vw' : sidebar === 'close' ? '4rem' : '17rem',
        maxWidth: '17rem',
      }}
    >
      <div className="flex justify-between items-center">
        {sidebar == 'open' ? (
          <Button variant="icon">
            <LogoColored className="w-5 h-5" />
          </Button>
        ) : (
          isMobile && (
            <Button variant="icon">
              <LogoColored className="w-5 h-5" />
            </Button>
          )
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            {!isMobile ? (
              <Button variant="icon" onClick={() => dispatch(toggleSidebar())}>
                <SidebarIcon className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => dispatch(closeSidebar())}
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Close</span>
              </Button>
            )}
          </TooltipTrigger>
          <TooltipContent>
            <p>{sidebar == 'close' ? 'Open sidebar' : 'Close sidebar'}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <ul className="flex flex-col">
        {navLinks.map((nav) => (
          <NavLink key={nav.id} nav={nav} />
        ))}
      </ul>

      <div ref={userMenuRef} className="mt-auto">
        {/* <UserMenu onLogout={onLogout} /> */}
      </div>
    </nav>
  );
};

export default Sidebar;

import Tag from '@/components/ui/Tag';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  closeSidebar,
  toggleSearchModal,
} from '@/features/app/slices/appSlice';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { RootState } from '@/store/store';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { Nav } from '../../data/interfaces';

interface NavLinkProps {
  nav: Nav;
}

const parseHotKey = (hotKey: string) =>
  hotKey.split('+').map((k) => k.trim().toLowerCase());

const NavLink: React.FC<NavLinkProps> = ({ nav }) => {
  const location = useLocation();
  const isMobile = useMediaQuery('mobile');
  const [isHovered, setIsHovered] = useState(false);
  const [ctrlPressed, setCtrlPressed] = useState(false);
  const sidebar = useSelector((state: RootState) => state.app.sidebar);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isActive = nav.path
    ? nav.path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(nav.path)
    : false;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) setCtrlPressed(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey) setCtrlPressed(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!nav.hotKey) return;
    const keys = parseHotKey(nav.hotKey);

    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = keys.includes('ctrl') ? e.ctrlKey : true;
      const shift = keys.includes('shift') ? e.shiftKey : true;
      const alt = keys.includes('alt') ? e.altKey : true;
      const meta = keys.includes('meta') ? e.metaKey : true;
      if (!ctrl || !shift || !alt || !meta) return;

      const mainKey = keys.find(
        (k) => !['ctrl', 'shift', 'alt', 'meta'].includes(k)
      );

      if (mainKey && e.key.toLowerCase() === mainKey) {
        e.preventDefault();
        if (!nav.path) {
          dispatch(toggleSearchModal());
        } else {
          navigate(nav.path);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [nav.hotKey, nav.path, navigate, dispatch]);

  const handleClick = (e: React.MouseEvent) => {
    if (!nav.path) {
      e.preventDefault();
      dispatch(toggleSearchModal());
    }
  };

  const content = (
    <>
      <div className="opacity-80">{nav.icon}</div>
      <span className="font-medium text-[15px] opacity-85 whitespace-nowrap">
        {nav.label}
      </span>

      {nav.hotKey &&
        sidebar === 'open' &&
        !isMobile &&
        (isHovered || ctrlPressed) && (
          <span className="absolute top-1/2 -translate-y-1/2 right-2.5 text-xs opacity-60 whitespace-nowrap">
            {nav.hotKey}
          </span>
        )}

      {sidebar === 'open' && nav.tag && (
        <Tooltip>
          <TooltipTrigger className="-translate-y-0.5">
            <Tag>{nav.tag.label}</Tag>
          </TooltipTrigger>
          <TooltipContent>
            <p>{nav.tag.explanation}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </>
  );

  return nav.path ? (
    <Link
      to={nav.path}
      className={`flex items-center gap-3.75 py-2.5 px-3 min-h-11 relative rounded-lg ${
        isActive ? 'bg-[var(--color-hover)]' : ''
      } hover:bg-[var(--color-hover)] transition-colors duration-200 ease-in-out overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (isMobile) dispatch(closeSidebar());
      }}
    >
      {content}
    </Link>
  ) : (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center gap-3.75 p-2.5 min-h-11 relative rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors duration-200 ease-in-out overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {content}
    </button>
  );
};

export default NavLink;

import { Gear, Menu } from '@/assets/icons/Setting';
import { Verified } from '@/assets/icons/Verified';
import { Header, Sidebar } from '@/components/layout';
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tag,
} from '@/components/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader, openAlertDialog, toggleSidebar } from '@/features/app';
import { useLogout } from '@/features/auth';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { AppDispatch, RootState } from '@/store/store';
import { Bell, ChevronDown, LogOut } from 'lucide-react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('mobile');
  const { logout, isLoading: isLoggingOut } = useLogout();
  const user = useSelector((state: RootState) => state.auth.user);

  React.useEffect(() => {
    if (location.pathname === '/') {
      navigate('/for-you', { replace: true });
    }
  }, [location.pathname, navigate, user]);

  if (isLoggingOut) return <Loader message="Logging out" />;

  return (
    <main className="flex h-[100dvh] overflow-hidden">
      <Sidebar />
      <section className="flex-1 flex flex-col">
        <Header>
          <div className="flex items-center">
            {isMobile && (
              <Button variant="icon" onClick={() => dispatch(toggleSidebar())}>
                <Menu />
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 pl-3 cursor-pointer"
                >
                  <h1 className="font-medium text-xl">DDUSTACK</h1>
                  <ChevronDown className="opacity-70 w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuCheckboxItem checked>
                  <article className="w-full h-full">
                    <div className="flex items-center gap-1">
                      <h1 className="font-medium">DDUSTACK</h1> v1.0
                    </div>
                    <p className="opacity-70 text-sm">
                      Smart course explorer & more
                    </p>
                  </article>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem disabled>
                  <article className="relative w-full h-full opacity-50">
                    <div className="flex items-center gap-1">
                      <h1 className="font-medium">DDUSTACK</h1> v1.1
                      <Tag>SOON</Tag>
                    </div>
                    <p className="opacity-70 text-sm">New features coming</p>
                  </article>
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <Avatar className="md:mr-2">
                <AvatarImage src={user?.avatar ?? undefined} />
                <AvatarFallback>
                  <img
                    src="/illustrations/pfp-fallback.webp"
                    alt="default profile picture"
                    className="w-full h-full"
                  />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="flex items-center gap-2.5">
                <Avatar>
                  <AvatarImage src={user?.avatar ?? undefined} />
                  <AvatarFallback>
                    <img
                      src="/illustrations/pfp-fallback.webp"
                      alt="default profile picture"
                      className="w-full h-full"
                    />
                  </AvatarFallback>
                </Avatar>
                <article>
                  <h1 className="flex items-center text-[15px] gap-1.5">
                    {user?.first_name}{' '}
                    {user?.is_verified && (
                      <Verified className="w-3 h-3 text-[var(--color-info)]" />
                    )}
                  </h1>
                  <h2 className="text-[var(--color-text-muted)]">
                    {user?.email}
                  </h2>
                </article>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate('/notifications', { replace: true })}
              >
                <Bell className="w-4.5 h-4.5" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate('/settings', { replace: true })}
              >
                <Gear className="w-4.5 h-4.5" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="destructive"
                onClick={() =>
                  dispatch(
                    openAlertDialog({
                      title: 'Confirm Logout',
                      description: 'You are about to log out of DDUSTACK',
                      subDescription: `as ${user?.email}`,
                      action: {
                        label: 'Logout',
                        method: () => logout(),
                        target: '',
                      },
                    })
                  )
                }
              >
                <LogOut className="w-4.5 h-4.5" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Header>
        <div className="flex-1 relative overflow-y-auto">
          <Outlet />
        </div>
      </section>
    </main>
  );
};

export default Home;

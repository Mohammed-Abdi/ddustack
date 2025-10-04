import type React from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

import AlertDialog from '@/components/ui/AlertDialog';
import Auth from '@/pages/auth/Auth';
import Home from '@/pages/home/Home';
import Landing from '@/pages/landing/Landing';
import NotFound from '@/pages/status/NotFound';
import type { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import ScrollToHash from './ScrollToHash';

const Layout: React.FC = () => (
  <>
    <ScrollToHash />
    <Outlet />
    <Toaster position="top-center" richColors />
    <AlertDialog />
  </>
);

const Root: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  return user ? <Home /> : <Landing />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Root /> },
      {
        path: 'auth',
        element: <Auth />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Router;

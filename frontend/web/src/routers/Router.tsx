import type React from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

import { AlertDialog } from '@/components/ui';
import { NotFound, Notifications, Settings } from '@/features/app';
import { Auth, OAuthCallback, UserInstance, Users } from '@/features/auth';
import { Contents, ForYouContents } from '@/features/content';
import {
  CourseAssignments,
  CourseOfferings,
  Courses,
  SavedCourses,
} from '@/features/course';
import { Departments } from '@/features/department';
import { Intake, IntakeInstance } from '@/features/intake';
import { Schools } from '@/features/school';
import { Summarizer } from '@/features/summarizer';
import ForYou from '@/pages/home/components/ForYou';
import GpaAnalyzer from '@/pages/home/components/GpaAnalyzer';
import UpgradeRole from '@/pages/home/components/UpgradeRole';
import Home from '@/pages/home/Home';
import Landing from '@/pages/landing/Landing';
import type { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import AuthRoute from './AuthRoute';
import ProtectedRoute from './ProtectedRoute';
import RoleProtectedRoute from './RoleProtectedRoute';
import ScrollToHash from './ScrollToHash';

const Layout: React.FC = () => (
  <>
    <ScrollToHash />
    <Outlet />
    <Toaster position="top-center" richColors />
    <AlertDialog />
  </>
);

const AppHome: React.FC = () => (
  <ProtectedRoute allowedRoles={['admin', 'moderator', 'lecturer']}>
    <Home />
  </ProtectedRoute>
);

const Root: React.FC = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const isInitializing = useSelector(
    (state: RootState) => state.auth.isInitializing
  );

  if (isInitializing) return null;
  if (!accessToken) return <Landing />;
  return <AppHome />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Root /> },
      {
        path: 'auth',
        element: (
          <AuthRoute>
            <Auth />
          </AuthRoute>
        ),
      },
      {
        path: 'oauth/callback/:provider',
        element: <OAuthCallback />,
      },
      {
        path: '/',
        element: <AppHome />,
        children: [
          { path: 'for-you', element: <ForYou /> },
          { path: 'my-courses/:courseId', element: <ForYouContents /> },

          { path: 'summarizer', element: <Summarizer /> },
          { path: 'gpa-analyzer', element: <GpaAnalyzer /> },
          {
            path: 'users',
            element: (
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <Users />
              </RoleProtectedRoute>
            ),
          },
          {
            path: 'users/:userId',
            element: (
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <UserInstance />
              </RoleProtectedRoute>
            ),
          },
          {
            path: 'intake',
            element: (
              <RoleProtectedRoute
                allowedRoles={['ADMIN', 'LECTURER', 'MODERATOR']}
              >
                <Intake />
              </RoleProtectedRoute>
            ),
          },
          {
            path: 'intake/:intakeId',
            element: (
              <RoleProtectedRoute
                allowedRoles={['ADMIN', 'LECTURER', 'MODERATOR']}
              >
                <IntakeInstance />
              </RoleProtectedRoute>
            ),
          },
          {
            path: 'schools',
            element: (
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <Schools />
              </RoleProtectedRoute>
            ),
          },
          {
            path: 'departments',
            element: (
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <Departments />
              </RoleProtectedRoute>
            ),
          },
          {
            path: 'courses',
            element: (
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <Courses />
              </RoleProtectedRoute>
            ),
          },
          {
            path: 'course-offerings',
            element: (
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <CourseOfferings />
              </RoleProtectedRoute>
            ),
          },
          {
            path: 'course-assignments',
            element: (
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <CourseAssignments />
              </RoleProtectedRoute>
            ),
          },
          {
            path: 'saved-courses',
            element: (
              <RoleProtectedRoute
                allowedRoles={['STUDENT', 'MODERATOR', 'ADMIN']}
              >
                <SavedCourses />
              </RoleProtectedRoute>
            ),
          },
          {
            path: 'contents',
            element: (
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <Contents />
              </RoleProtectedRoute>
            ),
          },
          {
            path: 'upgrade-role',
            element: (
              <RoleProtectedRoute allowedRoles={['STUDENT']}>
                <UpgradeRole />
              </RoleProtectedRoute>
            ),
          },
          { path: 'notifications', element: <Notifications /> },

          { path: 'settings', element: <Settings /> },
        ],
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

import type React from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

import AlertDialog from '@/components/ui/AlertDialog';
import { NotFound, Notifications, Settings } from '@/features/app';
import { Auth, OAuthCallback, UserInstance, Users } from '@/features/auth';
import { ContentInstance, Contents } from '@/features/content';
import {
  CourseAssignments,
  CourseAssignmentsInstance,
  CourseInstance,
  CourseOfferings,
  CourseOfferingsInstance,
  Courses,
  SavedCourses,
} from '@/features/course';
import { DepartmentInstance, Departments } from '@/features/department';
import { Intake, IntakeInstance } from '@/features/intake';
import { SchoolInstance, Schools } from '@/features/school';
import ForYou from '@/pages/home/components/ForYou';
import GpaAnalyzer from '@/pages/home/components/GpaAnalyzer';
import Summarizer from '@/pages/home/components/Summarizer';
import UpgradeRole from '@/pages/home/components/UpgradeRole';
import Home from '@/pages/home/Home';
import Landing from '@/pages/landing/Landing';
import type { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import AuthRoute from './AuthRoute';
import ProtectedRoute from './ProtectedRoute';
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
          { path: 'summarizer', element: <Summarizer /> },
          { path: 'gpa-analyzer', element: <GpaAnalyzer /> },
          { path: 'users', element: <Users /> },
          { path: 'users/:userId', element: <UserInstance /> },
          { path: 'intake', element: <Intake /> },
          { path: 'intake/:intakeId', element: <IntakeInstance /> },
          { path: 'schools', element: <Schools /> },
          { path: 'schools/:schoolId', element: <SchoolInstance /> },
          { path: 'departments', element: <Departments /> },
          {
            path: 'departments/:departmentId',
            element: <DepartmentInstance />,
          },
          { path: 'courses', element: <Courses /> },
          { path: 'courses/:courseId', element: <CourseInstance /> },
          { path: 'course-offerings', element: <CourseOfferings /> },
          {
            path: 'course-offerings/:courseOfferingId',
            element: <CourseOfferingsInstance />,
          },
          { path: 'course-assignments', element: <CourseAssignments /> },
          {
            path: 'course-assignments/:courseAssignmentId',
            element: <CourseAssignmentsInstance />,
          },
          { path: 'saved-courses', element: <SavedCourses /> },
          { path: 'contents', element: <Contents /> },
          { path: 'contents/:contentId', element: <ContentInstance /> },
          { path: 'upgrade-role', element: <UpgradeRole /> },
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

import AdminDashboard from '../pages/admin/dashboard';
import AdminUsers from '../pages/admin/users/AdminUsers';
import AdminCreateUser from '../pages/admin/users/AdminCreateUsers';
import { RouteType } from '../types';
import InstructorDashboard from '../pages/instructor/InstructorDashboard';
import InstructorCourses from '../pages/instructor/courses/InstructorCourses';
import CreateCourse from '../pages/courses/CreateCourse';
import InstructorProfile from '../pages/instructor/profile/profile';
import EditCourse from '../pages/instructor/courses/InstructorEditCourse';
import InstructorSingleCourse from '../pages/instructor/courses/InstructorSingleCourse';
import InstructorCourseExam from '../pages/instructor/courses/exam/InstructorCourseExam';
import InstructorSubtitlePage from '../pages/instructor/courses/subtitles/InstructorSubtitlePage';
import LearningPage from '../pages/courses/course/LearningPage';
import TraineeCourses from '../pages/trainee/TraineeCourses';
import InstructorPolicy from '../pages/instructor/InstructorPolicy';
import TraineePolicy from '../pages/trainee/TraineePolicy';
import TraineeProfile from '../pages/trainee/TraineeProfile';
import TraineeChangePassword from '../pages/trainee/TraineeChangePassword';
import InstructorChangePassword from '../pages/instructor/profile/InstructorChangePassword';

const ProtectedRoutes: RouteType[] = [
  {
    path: 'invoices',
    element: <h1>Invoices </h1>,
    parent: false,
  },
  {
    path: 'admin',
    element: <AdminDashboard />,
    parent: false,
  },
  {
    path: 'admin/users',
    element: <AdminUsers />,
    parent: false,
  },
  {
    path: 'admin/users/create',
    element: <AdminCreateUser />,
    parent: false,
  },
  {
    path: 'instructor-policy',
    element: <InstructorPolicy />,
  },
  {
    path: 'trainee-policy',
    element: <TraineePolicy />,
  },

  {
    path: 'instructor/:id',
    element: <InstructorDashboard />,
    parent: false,
  },
  {
    path: 'instructor/:id/courses',
    element: <InstructorCourses />,
    parent: false,
  },
  {
    path: 'instructor/:instructorId/courses/:courseId',
    element: <InstructorSingleCourse />,
    parent: false,
  },
  {
    path: 'instructor/:instructorId/courses/:courseId/exam',
    element: <InstructorCourseExam />,
  },

  {
    path: 'instructor/:instructorId/courses/:courseId/subtitles/:subtitleId',
    element: <InstructorSubtitlePage />,
  },

  {
    path: 'courses/create',
    element: <CreateCourse />,
    parent: false,
  },
  {
    path: 'instructor/:id/profile',
    element: <InstructorProfile />,
    parent: false,
  },
  {
    path: 'instructor/:id/profile/change-password',
    element: <InstructorChangePassword />,
    parent: false,
  },
  {
    path: 'courses/:id/edit',
    element: <EditCourse />,
    parent: false,
  },
  {
    path: 'courses/:id/learning',
    element: <LearningPage />,
  },
  {
    path: 'trainee/:id/courses',
    element: <TraineeCourses />,
  },
  {
    path: 'trainee/:id/profile',
    element: <TraineeProfile />,
  },
  {
    path: 'trainee/:id/profile/change-password',
    element: <TraineeChangePassword />,
  },
];

export default ProtectedRoutes;

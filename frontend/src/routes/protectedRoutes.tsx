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
import CourseCertificate from '../components/courses/Certificate';
import TraineeReportedProblems from '../pages/trainee/TraineeReportedProblems';
import InstructorReportedProblems from '../pages/instructor/InstructorReportedProblems';
import AdminReportedProblems from '../pages/admin/AdminReportedProblems';
import AdminCourseAccessRequest from '../pages/admin/AdminCourseAccessRequest';
import AdminRefundRequests from '../pages/admin/AdminRefundRequests';
import AdminCourses from '../pages/admin/AdminCourses';

const ProtectedRoutes: RouteType[] = [
  {
    path: 'admin',
    element: <AdminDashboard />,
    parent: false,
    roles: ['admin'],
  },
  {
    path: 'admin/users',
    element: <AdminUsers />,
    parent: false,
    roles: ['admin'],
  },
  {
    path: 'admin/users/create',
    element: <AdminCreateUser />,
    parent: false,
    roles: ['admin'],
  },
  {
    path: 'instructor-policy',
    element: <InstructorPolicy />,
    roles: ['instructor'],
  },
  {
    path: 'trainee-policy',
    element: <TraineePolicy />,
    roles: ['trainee', 'corp_trainee'],
  },

  {
    path: 'instructor/:id',
    element: <InstructorDashboard />,
    parent: false,
    roles: ['instructor'],
  },
  {
    path: 'instructor/:id/courses',
    element: <InstructorCourses />,
    parent: false,
    roles: ['instructor'],
  },
  {
    path: 'instructor/:instructorId/courses/:courseId',
    element: <InstructorSingleCourse />,
    parent: false,
    roles: ['instructor'],
  },
  {
    path: 'instructor/:instructorId/courses/:courseId/exam',
    element: <InstructorCourseExam />,
    parent: false,
    roles: ['instructor'],
  },

  {
    path: 'instructor/:instructorId/courses/:courseId/subtitles/:subtitleId',
    element: <InstructorSubtitlePage />,
    parent: false,
    roles: ['instructor'],
  },

  {
    path: 'courses/create',
    element: <CreateCourse />,
    parent: false,
    roles: ['instructor'],
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
    roles: ['instructor'],
  },
  {
    path: 'courses/:id/edit',
    element: <EditCourse />,
    parent: false,
    roles: ['instructor'],
  },
  {
    path: 'courses/:id/learning',
    element: <LearningPage />,
    roles: ['trainee', 'corp_trainee'],
  },
  {
    path: 'courses/:id/certificate',
    element: <CourseCertificate />,
    roles: ['trainee', 'corp_trainee'],
  },
  {
    path: 'trainee/:id/courses',
    element: <TraineeCourses />,
    roles: ['trainee', 'corp_trainee'],
  },
  {
    path: 'trainee/:id/profile',
    element: <TraineeProfile />,
    roles: ['trainee', 'corp_trainee'],
  },
  {
    path: 'trainee/:id/reported-problems',
    element: <TraineeReportedProblems />,
    roles: ['trainee', 'corp_trainee'],
  },
  {
    path: 'instructor/:id/reported-problems',
    element: <InstructorReportedProblems />,
    roles: ['instructor'],
  },
  {
    path: 'admin/reported-problems',
    element: <AdminReportedProblems />,
    roles: ['admin'],
  },
  {
    path: 'admin/access-requests',
    element: <AdminCourseAccessRequest />,
    roles: ['admin'],
  },
  {
    path: 'admin/refund-requests',
    element: <AdminRefundRequests />,
    roles: ['admin'],
  },
  {
    path: 'admin/courses',
    element: <AdminCourses />,
    roles: ['admin'],
  },
  {
    path: 'trainee/:id/profile/change-password',
    element: <TraineeChangePassword />,
    roles: ['trainee', 'corp_trainee'],
  },
];

export default ProtectedRoutes;

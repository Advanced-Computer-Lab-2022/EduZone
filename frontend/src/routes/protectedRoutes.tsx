import AdminDashboard from '../pages/admin/dashboard';
import AdminUsers from '../pages/admin/users/AdminUsers';
import AdminCreateUser from '../pages/admin/users/AdminCreateUsers';
import { RouteType } from '../types';
import InstructorDashboard from '../pages/instructors/InstructorDashboard';
import InstructorCourses from '../pages/instructors/courses/InstructorCourses';
import CreateCourse from '../pages/courses/CreateCourse';
import InstructorProfile from '../pages/instructors/profile/profile';
import EditCourse from '../pages/courses/EditCourse';

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
    path: 'instructors/:id',
    element: <InstructorDashboard />,
    parent: false,
  },
  {
    path: 'instructors/:id/courses',
    element: <InstructorCourses />,
    parent: false,
  },
  {
    path: 'courses/create',
    element: <CreateCourse />,
    parent: false,
  },
  {
    path: 'instructors/:id/profile',
    element: <InstructorProfile />,
    parent: false,
  },
  {
    path: 'courses/:id/edit',
    element: <EditCourse />,
    parent: false,
  },
];

export default ProtectedRoutes;

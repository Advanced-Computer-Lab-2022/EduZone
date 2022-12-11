import CreateCourse from '../pages/courses/CreateCourse';
import Courses from '../pages/courses/courses';
import SingleCourse from '../pages/courses/singleCourse';
import Home from '../pages/home';
import LoginPage from '../pages/login';
import { RouteType } from '../types';

const UnProtectedRoutes: RouteType[] = [
  {
    path: '/',
    parent: false,
    element: <Home />,
  },
  {
    path: '/courses',
    parent: false,
    element: <Courses />,
    children: [
      {
        path: ':id',
        element: <SingleCourse />,
      },
    ],
  },
  {
    path: '/courses/:id',
    parent: false,
    element: <SingleCourse />,
  },
  {
    path: '/login',
    parent: false,
    element: <LoginPage />,
  },
  {
    path: '/register',
    parent: false,
    element: <h1>Register</h1>,
  },
  {
    path: 'reset-password/:token',
    parent: false,
    element: <h1>Reset Password</h1>,
  },
  {
    path: 'forget-password',
    parent: false,
    element: <h1>Forgot Password</h1>,
  },
];

export default UnProtectedRoutes;

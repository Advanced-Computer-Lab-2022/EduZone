import CreateCourse from '../pages/courses/CreateCourse';
import Courses from '../pages/courses/courses';
import SingleCourse from '../pages/courses/course/singleCourse';
import Home from '../pages/home';
import LoginPage from '../pages/login';
import { RouteType } from '../types';
import ForgetPassword from '../pages/ForgetPassword';
import ResetPassword from '../pages/ResetPassword';
import RegisterPage from '../pages/register';

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
    element: <RegisterPage />,
  },
  {
    path: 'reset-password/:token',
    parent: false,
    element: <ResetPassword />,
  },
  {
    path: '/forget-password',
    parent: false,
    element: <ForgetPassword />,
  },
];

export default UnProtectedRoutes;

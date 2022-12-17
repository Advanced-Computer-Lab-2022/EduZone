import CreateCourse from '../pages/courses/CreateCourse';
import Courses from '../pages/courses/courses';
import SingleCourse from '../pages/courses/course/singleCourse';
import Home from '../pages/home';
import LoginPage from '../pages/login';
import { RouteType } from '../types';
import ForgetPassword from '../pages/ForgetPassword';
import ResetPassword from '../pages/ResetPassword';
import SignUp from '../pages/signUp';
import CoursePayment from '../components/courses/CoursePayment';

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
    element: <SignUp />,
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
  {
    path: '/courses/:id/buy',
    parent: false,
    element: <CoursePayment />,
  },
];

export default UnProtectedRoutes;

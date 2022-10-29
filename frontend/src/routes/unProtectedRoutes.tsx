import Courses from '../pages/courses/courses';
import Home from '../pages/home';
import LoginPage from '../pages/login';

const UnProtectedRoutes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/courses',
    element: <Courses />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <h1>Register</h1>,
  },
];

export default UnProtectedRoutes;

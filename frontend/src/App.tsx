import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import Courses from './pages/courses/courses';
import SingleCourse from './pages/courses/course/singleCourse';
import Home from './pages/home';
import { RootState } from './redux/store';
import { ProtectedRoutes, UnProtectedRoutes } from './routes';
import Alert from './components/common/Alert';
import NotFoundPage from './pages/404';

function App() {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const role = user?.role;
  return (
    <div className="App">
      <Alert />
      <Routes>
        {UnProtectedRoutes.map((route) => {
          if (!route.parent)
            return (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            );

          return (
            <Route key={route.path} path={route.path} element={route.element}>
              {route.children?.map((child) => (
                <Route
                  key={child.path}
                  path={child.path}
                  element={child.element}
                />
              ))}
            </Route>
          );
        })}

        {isAuthenticated ? (
          ProtectedRoutes.map((route) => {
            if (route.roles?.includes(role))
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              );
            return null;
          })
        ) : (
          <Route path="/auth" element={<Navigate to="/login" />}></Route>
        )}
        <Route path="*" element={<NotFoundPage />} />
        {/* <Route path="login" element={<LoginPage />} /> */}
        {/*<Route path="invoices" element={<Invoices />} /> */}
      </Routes>
    </div>
  );
}

export default App;

import { Navigate, Outlet } from 'react-router';
import { ROUTE } from '@/constants/router.ts';
import { hasAuthCredentials } from '@/helpers/authStorage.ts';

const RequireAuth = () => {
  if (!hasAuthCredentials()) {
    return <Navigate to={ROUTE.LOGIN} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;

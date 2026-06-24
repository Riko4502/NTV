import type { FC, ReactElement, ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../providers/store';
import { paths } from './paths';

interface RequireAuthProps {
  children?: ReactNode;
}

export const RequireAuth: FC<RequireAuthProps> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={paths.login} replace state={{ from: location }} />;
  }

  return children ? (children as ReactElement) : <Outlet />;
};

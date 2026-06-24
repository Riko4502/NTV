import type { FC, JSX, ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../providers/store';
import { paths } from './paths';

interface OnlyPublicProps {
  children?: ReactNode;
}

export const OnlyPublic: FC<OnlyPublicProps> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  if (isAuthenticated) {
    const state = location.state as { from?: { pathname: string } } | null;
    const from = state?.from?.pathname || paths.root;
    return <Navigate to={from} replace />;
  }

  return children ? (children as JSX.Element) : <Outlet />;
};

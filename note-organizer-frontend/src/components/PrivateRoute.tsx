import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import type { JSX } from 'react';

interface Props {
  children: JSX.Element;
}

export default function PrivateRoute({ children }: Props): JSX.Element {
  const { token } = useAuth();
  return token ? children : <Navigate to="/" />;
}

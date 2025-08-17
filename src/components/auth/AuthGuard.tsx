
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loading } from '@/components/ui/loading';
import { PendingApprovalScreen } from './PendingApprovalScreen';

interface AuthGuardProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireApproved?: boolean;
}

export const AuthGuard = ({ 
  children, 
  requireAdmin = false, 
  requireApproved = true 
}: AuthGuardProps) => {
  const { user, profile, loading, isAuthenticated, isAdmin, isApproved } = useAuth();
  const location = useLocation();

  // Mostrar loading enquanto carrega
  if (loading) {
    return <Loading text="Verificando autenticação..." />;
  }

  // Se não está autenticado, redirecionar para login
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Se requer admin e não é admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Se requer aprovação e não está aprovado (mas não é admin)
  if (requireApproved && !isApproved && !isAdmin) {
    return <PendingApprovalScreen />;
  }

  // Se chegou até aqui, pode acessar
  return <>{children}</>;
};

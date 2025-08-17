import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Loading } from '@/components/ui/loading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireAgent?: boolean;
  requireApproved?: boolean;
  permissions?: string[];
  anyPermission?: string[];
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  requireAgent = false,
  requireApproved = true,
  permissions = [],
  anyPermission = [],
  fallback
}) => {
  const { 
    isAuthenticated, 
    isAdmin, 
    isAgent, 
    isApproved, 
    isPending, 
    isRejected,
    hasPermission,
    hasAnyPermission,
    loading 
  } = useAuth();
  
  const [permissionChecks, setPermissionChecks] = useState<{
    specific: boolean;
    any: boolean;
  }>({ specific: true, any: true });
  const [checkingPermissions, setCheckingPermissions] = useState(false);

  // Verificar permissões específicas
  useEffect(() => {
    const checkPermissions = async () => {
      if (permissions.length === 0 && anyPermission.length === 0) {
        setPermissionChecks({ specific: true, any: true });
        return;
      }

      setCheckingPermissions(true);
      
      try {
        const [specificResult, anyResult] = await Promise.all([
          permissions.length > 0 
            ? Promise.all(permissions.map(p => hasPermission(p)))
            : Promise.resolve([true]),
          anyPermission.length > 0 
            ? hasAnyPermission(anyPermission)
            : Promise.resolve(true)
        ]);

        setPermissionChecks({
          specific: permissions.length === 0 || specificResult.every(Boolean),
          any: anyResult
        });
      } catch (error) {
        console.error('Error checking permissions:', error);
        setPermissionChecks({ specific: false, any: false });
      } finally {
        setCheckingPermissions(false);
      }
    };

    if (isAuthenticated && !loading) {
      checkPermissions();
    }
  }, [isAuthenticated, loading, permissions, anyPermission, hasPermission, hasAnyPermission]);

  // Loading state
  if (loading || checkingPermissions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Verificando permissões..." />
      </div>
    );
  }

  // Verificar se precisa estar autenticado
  if (requireAuth && !isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>
              Você precisa estar logado para acessar esta página.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link to="/auth">Fazer Login</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link to="/">Voltar ao Início</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificar se precisa ser admin
  if (requireAdmin && !isAdmin) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>
              Esta área é restrita apenas para administradores.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link to="/">Voltar ao Início</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificar se precisa ser agente
  if (requireAgent && !isAgent && !isAdmin) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>
              Esta área é restrita apenas para agentes da polícia.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link to="/">Voltar ao Início</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificar se precisa estar aprovado
  if (requireApproved && isPending) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <CardTitle>Conta Pendente</CardTitle>
            <CardDescription>
              Sua conta está aguardando aprovação de um administrador.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-700">
                Você receberá uma notificação quando sua conta for aprovada.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild className="flex-1">
                <Link to="/">Voltar ao Início</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificar se foi rejeitado
  if (isRejected) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Conta Rejeitada</CardTitle>
            <CardDescription>
              Sua solicitação de registro foi rejeitada.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-700">
                Entre em contato com a administração para mais informações.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild className="flex-1">
                <Link to="/">Voltar ao Início</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificar permissões específicas
  if (!permissionChecks.specific) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Permissão Insuficiente</CardTitle>
            <CardDescription>
              Você não possui as permissões necessárias para acessar esta área.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-700">
                Permissões necessárias: {permissions.join(', ')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link to="/">Voltar ao Início</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificar permissões alternativas
  if (!permissionChecks.any) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Permissão Insuficiente</CardTitle>
            <CardDescription>
              Você não possui nenhuma das permissões necessárias para acessar esta área.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-700">
                Pelo menos uma das permissões é necessária: {anyPermission.join(', ')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link to="/">Voltar ao Início</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se passou por todas as verificações, renderizar o conteúdo
  return <>{children}</>;
};
import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import policeBadge from '@/assets/police-badge.png';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'login');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'register' || tab === 'login') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center">
        <div className="animate-pulse">
          <Shield className="h-16 w-16 text-primary mx-auto" />
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo e Cabeçalho */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <img 
              src={policeBadge} 
              alt="Brasão Polícia Civil" 
              className="h-16 w-16"
            />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-primary">Polícia Civil</h1>
              <p className="text-sm text-muted-foreground">Portal Roleplay</p>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Acesso Restrito
            </h2>
            <p className="text-muted-foreground text-sm">
              Área exclusiva para membros da corporação
            </p>
          </div>
        </div>

        {/* Formulários de Autenticação */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Registro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-6">
            <LoginForm />
          </TabsContent>
          
          <TabsContent value="register" className="mt-6">
            <RegisterForm />
          </TabsContent>
        </Tabs>

        {/* Rodapé */}
        <div className="text-center text-xs text-muted-foreground">
          © 2024 Polícia Civil Roleplay. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
};

export default Auth;
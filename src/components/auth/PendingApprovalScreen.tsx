
import { Clock, Shield, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import policeBadge from '@/assets/police-badge.png';

export const PendingApprovalScreen = () => {
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const getProfileTypeLabel = (type: string) => {
    switch (type) {
      case 'citizen':
        return 'Cidadão';
      case 'agent':
        return 'Agente';
      case 'admin':
        return 'Administrador';
      default:
        return 'Usuário';
    }
  };

  const getStatusMessage = () => {
    switch (profile?.approval_status) {
      case 'pending':
        return {
          title: 'Conta Aguardando Aprovação',
          description: 'Sua conta está sendo analisada por um administrador. Você receberá uma notificação quando for aprovada.',
          icon: <Clock className="h-8 w-8 text-yellow-500" />,
          color: 'border-yellow-200 bg-yellow-50'
        };
      case 'rejected':
        return {
          title: 'Conta Rejeitada',
          description: profile.rejection_reason || 'Sua conta foi rejeitada. Entre em contato com um administrador para mais informações.',
          icon: <AlertCircle className="h-8 w-8 text-red-500" />,
          color: 'border-red-200 bg-red-50'
        };
      default:
        return {
          title: 'Status Indefinido',
          description: 'Status da conta não identificado. Entre em contato com o suporte.',
          icon: <AlertCircle className="h-8 w-8 text-gray-500" />,
          color: 'border-gray-200 bg-gray-50'
        };
    }
  };

  const statusInfo = getStatusMessage();

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
        </div>

        {/* Card de Status */}
        <Card className={`${statusInfo.color} border-2`}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {statusInfo.icon}
            </div>
            <CardTitle className="text-xl">{statusInfo.title}</CardTitle>
            <CardDescription className="text-center">
              {statusInfo.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Informações do Usuário */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Nome:</span>
                <span className="text-sm">{profile?.full_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm">{profile?.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Tipo de Perfil:</span>
                <Badge variant="secondary">
                  {getProfileTypeLabel(profile?.profile_type || '')}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Data de Registro:</span>
                <span className="text-sm">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                </span>
              </div>
            </div>

            {/* Instruções */}
            <div className="mt-6 p-4 bg-background/50 rounded-lg">
              <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                O que fazer agora?
              </h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Aguarde a análise do administrador</li>
                <li>• Verifique seu email regularmente</li>
                <li>• Em caso de dúvidas, entre em contato</li>
                {profile?.approval_status === 'rejected' && (
                  <li>• Você pode criar uma nova conta se necessário</li>
                )}
              </ul>
            </div>

            {/* Botão de Logout */}
            <Button 
              onClick={handleSignOut} 
              variant="outline" 
              className="w-full"
            >
              Sair da Conta
            </Button>
          </CardContent>
        </Card>

        {/* Rodapé */}
        <div className="text-center text-xs text-muted-foreground">
          © 2024 Polícia Civil Roleplay. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
};

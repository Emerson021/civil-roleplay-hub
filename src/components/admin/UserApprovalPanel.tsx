
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loading } from '@/components/ui/loading';
import { useAuth, ProfileType } from '@/hooks/useAuth';
import { Check, X, Clock, UserCheck, Users, AlertTriangle } from 'lucide-react';

interface UserWithApprover {
  user_id: string;
  full_name: string | null;
  email: string | null;
  profile_type: ProfileType;
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_by?: string | null;
  approved_at?: string | null;
  rejection_reason?: string | null;
  badge_number?: string | null;
  department?: string | null;
  rank?: string | null;
  phone?: string | null;
  cpf?: string | null;
  date_of_birth?: string | null;
  created_at: string;
  approved_by_profile?: {
    full_name: string | null;
  } | null;
}

export const UserApprovalPanel = () => {
  const { getPendingUsers, getAllUsers, approveUser } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<UserWithApprover[]>([]);
  const [allUsers, setAllUsers] = useState<UserWithApprover[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingUser, setApprovingUser] = useState<string | null>(null);
  const [selectedProfileType, setSelectedProfileType] = useState<ProfileType>('citizen');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [pending, all] = await Promise.all([
        getPendingUsers(),
        getAllUsers()
      ]);
      setPendingUsers(pending as UserWithApprover[]);
      setAllUsers(all as UserWithApprover[]);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (userId: string, approve: boolean) => {
    setApprovingUser(userId);
    try {
      const result = await approveUser(
        userId,
        approve ? selectedProfileType : 'citizen',
        approve ? undefined : rejectionReason
      );
      
      if (result.success) {
        await fetchUsers(); // Refresh data
        setIsApprovalDialogOpen(false);
        setRejectionReason('');
        setSelectedProfileType('citizen');
      }
    } catch (error) {
      console.error('Error approving user:', error);
    } finally {
      setApprovingUser(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-600"><Check className="h-3 w-3 mr-1" />Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600"><X className="h-3 w-3 mr-1" />Rejeitado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getProfileTypeBadge = (type: ProfileType) => {
    switch (type) {
      case 'citizen':
        return <Badge variant="secondary">Cidadão</Badge>;
      case 'agent':
        return <Badge variant="default" className="bg-blue-500">Agente</Badge>;
      case 'admin':
        return <Badge variant="default" className="bg-red-500">Admin</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <Loading text="Carregando usuários..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Usuários</h2>
          <p className="text-muted-foreground">
            Aprove ou rejeite registros de usuários e gerencie perfis
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchUsers}>
            <Users className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pendentes ({pendingUsers.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Todos os Usuários ({allUsers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingUsers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <UserCheck className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum usuário pendente de aprovação</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingUsers.map((user) => (
                <Card key={user.user_id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{user.full_name || 'Nome não informado'}</CardTitle>
                        <CardDescription>{user.email || 'Email não informado'}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(user.approval_status)}
                        {getProfileTypeBadge(user.profile_type)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label className="text-sm font-medium">Telefone</Label>
                        <p className="text-sm text-muted-foreground">{user.phone || 'Não informado'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">CPF</Label>
                        <p className="text-sm text-muted-foreground">{user.cpf || 'Não informado'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Data de Nascimento</Label>
                        <p className="text-sm text-muted-foreground">
                          {user.date_of_birth ? formatDate(user.date_of_birth) : 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Data de Registro</Label>
                        <p className="text-sm text-muted-foreground">{formatDate(user.created_at)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => {
                              setSelectedProfileType('citizen');
                              setRejectionReason('');
                            }}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Aprovar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Aprovar Usuário</DialogTitle>
                            <DialogDescription>
                              Defina o tipo de perfil para {user.full_name || 'este usuário'}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="profile-type">Tipo de Perfil</Label>
                              <Select value={selectedProfileType} onValueChange={(value: ProfileType) => setSelectedProfileType(value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo de perfil" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="citizen">Cidadão</SelectItem>
                                  <SelectItem value="agent">Agente</SelectItem>
                                  <SelectItem value="admin">Administrador</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleApprove(user.user_id, true)}
                                disabled={approvingUser === user.user_id}
                                className="flex-1"
                              >
                                {approvingUser === user.user_id ? 'Aprovando...' : 'Confirmar Aprovação'}
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => setIsApprovalDialogOpen(false)}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Rejeitar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Rejeitar Usuário</DialogTitle>
                            <DialogDescription>
                              Informe o motivo da rejeição para {user.full_name || 'este usuário'}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="rejection-reason">Motivo da Rejeição</Label>
                              <Textarea
                                id="rejection-reason"
                                placeholder="Informe o motivo da rejeição..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={3}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleApprove(user.user_id, false)}
                                disabled={approvingUser === user.user_id || !rejectionReason.trim()}
                                variant="destructive"
                                className="flex-1"
                              >
                                {approvingUser === user.user_id ? 'Rejeitando...' : 'Confirmar Rejeição'}
                              </Button>
                              <Button variant="outline">
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {allUsers.map((user) => (
              <Card key={user.user_id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{user.full_name || 'Nome não informado'}</CardTitle>
                      <CardDescription>{user.email || 'Email não informado'}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(user.approval_status)}
                      {getProfileTypeBadge(user.profile_type)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Telefone</Label>
                      <p className="text-sm text-muted-foreground">{user.phone || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">CPF</Label>
                      <p className="text-sm text-muted-foreground">{user.cpf || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Data de Registro</Label>
                      <p className="text-sm text-muted-foreground">{formatDate(user.created_at)}</p>
                    </div>
                  </div>

                  {user.approval_status === 'approved' && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <UserCheck className="h-4 w-4" />
                        <span className="text-sm font-medium">Aprovado por: {user.approved_by_profile?.full_name || 'Sistema'}</span>
                      </div>
                      {user.approved_at && (
                        <p className="text-sm text-green-600 mt-1">
                          Em: {formatDate(user.approved_at)}
                        </p>
                      )}
                    </div>
                  )}

                  {user.approval_status === 'rejected' && user.rejection_reason && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">Motivo da rejeição:</span>
                      </div>
                      <p className="text-sm text-red-600 mt-1">{user.rejection_reason}</p>
                    </div>
                  )}

                  {user.profile_type === 'agent' && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-blue-700">Distintivo</Label>
                          <p className="text-sm text-blue-600">{user.badge_number || 'Não informado'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-blue-700">Departamento</Label>
                          <p className="text-sm text-blue-600">{user.department || 'Não informado'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-blue-700">Patente</Label>
                          <p className="text-sm text-blue-600">{user.rank || 'Não informado'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

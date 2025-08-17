
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export type ProfileType = 'citizen' | 'agent' | 'admin';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface Profile {
  user_id: string;
  full_name: string | null;
  email: string | null;
  profile_type: ProfileType;
  approval_status: ApprovalStatus;
  approved_by?: string | null;
  approved_at?: string | null;
  rejection_reason?: string | null;
  badge_number?: string | null;
  department?: string | null;
  rank?: string | null;
  phone?: string | null;
  cpf?: string | null;
  date_of_birth?: string | null;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  avatar_url?: string | null;
  bio?: string | null;
  id: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  
  // Refs para controlar o estado
  const isInitializedRef = useRef(false);
  const subscriptionRef = useRef<any>(null);

  // Verificar permissões
  const hasPermission = async (permissionName: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase.rpc('has_permission', {
        permission_name: permissionName
      });
      
      if (error) {
        console.error('Error checking permission:', error);
        return false;
      }
      
      return Boolean(data);
    } catch (error) {
      console.error('Error in hasPermission:', error);
      return false;
    }
  };

  // Verificar múltiplas permissões
  const hasAnyPermission = async (permissionNames: string[]): Promise<boolean> => {
    for (const permission of permissionNames) {
      if (await hasPermission(permission)) {
        return true;
      }
    }
    return false;
  };

  // Verificar se tem todas as permissões
  const hasAllPermissions = async (permissionNames: string[]): Promise<boolean> => {
    for (const permission of permissionNames) {
      if (!(await hasPermission(permission))) {
        return false;
      }
    }
    return true;
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as Profile;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  const signUp = async (email: string, password: string, profileData: {
    full_name: string;
    phone?: string;
    cpf?: string;
    date_of_birth?: string;
    profile_type?: ProfileType;
  }) => {
    try {
      console.log('Iniciando registro com dados:', { email, profileData });
      
      // Primeiro, criar o usuário no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: {
            full_name: profileData.full_name,
            phone: profileData.phone,
            cpf: profileData.cpf,
            date_of_birth: profileData.date_of_birth,
            profile_type: profileData.profile_type || 'citizen'
          }
        }
      });

      if (error) {
        console.error('Supabase Auth Error:', error);
        toast({
          title: "Erro no registro",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error };
      }

      console.log('Usuário criado no Auth:', data);

      toast({
        title: "Registro realizado",
        description: "Aguarde a aprovação de um administrador para acessar o sistema.",
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error in signUp:', error);
      toast({
        title: "Erro no registro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { success: false, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      setUser(null);
      setProfile(null);
      setSession(null);
      return { error };
    } catch (error) {
      console.error('Error in signOut:', error);
      return { error };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        toast({
          title: "Erro ao atualizar perfil",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error };
      }

      setProfile(data as Profile);
      toast({
        title: "Perfil atualizado",
        description: "Seu perfil foi atualizado com sucesso.",
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return { success: false, error };
    }
  };

  // Aprovar usuário (apenas admins)
  const approveUser = async (
    userId: string, 
    profileType: ProfileType = 'citizen',
    rejectionReason?: string
  ) => {
    try {
      const { data, error } = await supabase.rpc('approve_user', {
        user_id_to_approve: userId,
        new_profile_type: profileType,
        rejection_reason: rejectionReason
      });

      if (error) {
        toast({
          title: "Erro ao aprovar usuário",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error };
      }

      toast({
        title: "Usuário processado",
        description: rejectionReason ? "Usuário rejeitado." : "Usuário aprovado com sucesso.",
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error in approveUser:', error);
      return { success: false, error };
    }
  };

  // Buscar usuários pendentes (apenas admins)
  const getPendingUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          approved_by_profile:profiles!profiles_approved_by_fkey(full_name)
        `)
        .eq('approval_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pending users:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPendingUsers:', error);
      return [];
    }
  };

  // Buscar todos os usuários (apenas admins)
  const getAllUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          approved_by_profile:profiles!profiles_approved_by_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      return [];
    }
  };

  // Inicialização CORRIGIDA - VERSÃO FINAL
  useEffect(() => {
    // Evitar múltiplas inicializações
    if (isInitializedRef.current) {
      console.log('useAuth já foi inicializado, ignorando...');
      return;
    }

    isInitializedRef.current = true;
    console.log('Iniciando autenticação...');

    let isMounted = true;

    const initAuth = async () => {
      try {
        // Obter sessão inicial
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao obter sessão:', error);
        }
        
        if (!isMounted) return;
        
        setSession(session);
        
        if (session?.user) {
          const mappedUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            created_at: session.user.created_at,
            updated_at: session.user.updated_at
          };
          setUser(mappedUser);
          
          console.log('Usuário encontrado, buscando perfil...');
          const userProfile = await fetchProfile(session.user.id);
          if (isMounted) {
            setProfile(userProfile);
          }
        } else {
          console.log('Nenhum usuário logado');
          setUser(null);
        }
      } catch (error) {
        console.error('Erro na inicialização:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
          console.log('Autenticação inicializada - Loading: false');
        }
      }
    };

    // Executar inicialização
    initAuth();

    // Escutar mudanças na autenticação - VERSÃO SIMPLIFICADA
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        if (!isMounted) return;
        
        // Atualizar estado imediatamente
        setSession(session);
        
        if (session?.user) {
          const mappedUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            created_at: session.user.created_at,
            updated_at: session.user.updated_at
          };
          setUser(mappedUser);
          
          console.log('Usuário logado, buscando perfil...');
          const userProfile = await fetchProfile(session.user.id);
          if (isMounted) {
            setProfile(userProfile);
            setLoading(false);
            console.log('Login processado - Loading: false');
          }
        } else {
          if (isMounted) {
            setUser(null);
            setProfile(null);
            setLoading(false);
            console.log('Logout processado - Loading: false');
          }
        }
      }
    );

    // Armazenar referência da subscription
    subscriptionRef.current = subscription;

    // Cleanup function
    return () => {
      isMounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, []); // Dependências vazias para executar apenas uma vez

  // Fallback: se após 5 segundos ainda estiver loading, forçar false
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading && !initialized) {
        console.log('Timeout: forçando loading = false');
        setLoading(false);
        setInitialized(true);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [loading, initialized]);

  // Computed properties
  const isAuthenticated = !!user && !!profile;
  const isAdmin = profile?.profile_type === 'admin';
  const isAgent = profile?.profile_type === 'agent';
  const isCitizen = profile?.profile_type === 'citizen';
  const isApproved = profile?.approval_status === 'approved';
  const isPending = profile?.approval_status === 'pending';
  const isRejected = profile?.approval_status === 'rejected';

  return {
    user,
    profile,
    session,
    loading,
    initialized,
    isAuthenticated,
    isAdmin,
    isAgent,
    isCitizen,
    isApproved,
    isPending,
    isRejected,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    signUp,
    signIn,
    signOut,
    updateProfile,
    approveUser,
    getPendingUsers,
    getAllUsers,
  };
};

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface Concurso {
  id: string;
  titulo: string;
  orgao: string;
  vagas: number;
  salario: string;
  inscricoes_inicio: string;
  inscricoes_fim: string;
  data_prova: string;
  situacao: 'Inscrições Abertas' | 'Em Andamento' | 'Encerrado' | 'Cancelado';
  edital_url: string | null;
  local: string;
  descricao: string | null;
  requisitos: string | null;
  beneficios: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  is_active: boolean;
}

export const useConcursos = () => {
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  const fetchConcursos = async () => {
    try {
      let query = supabase
        .from('concursos')
        .select('*')
        .order('created_at', { ascending: false });

      // Se não for admin, só buscar concursos ativos
      if (!isAdmin) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching concursos:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os concursos",
          variant: "destructive",
        });
        return;
      }

      setConcursos((data as Concurso[]) || []);
    } catch (error) {
      console.error('Error in fetchConcursos:', error);
    } finally {
      setLoading(false);
    }
  };

  const createConcurso = async (concursoData: {
    titulo: string;
    orgao: string;
    vagas: number;
    salario: string;
    inscricoes_inicio: string;
    inscricoes_fim: string;
    data_prova: string;
    situacao: string;
    local: string;
    descricao?: string;
    requisitos?: string;
    beneficios?: string;
    edital_url?: string;
  }) => {
    if (!isAdmin) {
      toast({
        title: "Erro",
        description: "Você não tem permissão para criar concursos",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('concursos')
        .insert(concursoData)
        .select()
        .single();

      if (error) {
        console.error('Error creating concurso:', error);
        toast({
          title: "Erro",
          description: "Não foi possível criar o concurso",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Sucesso",
        description: "Concurso criado com sucesso",
      });

      fetchConcursos(); // Refresh concursos
      return data;
    } catch (error) {
      console.error('Error in createConcurso:', error);
      return null;
    }
  };

  const updateConcurso = async (id: string, updates: Partial<Concurso>) => {
    if (!isAdmin) {
      toast({
        title: "Erro",
        description: "Você não tem permissão para editar concursos",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('concursos')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating concurso:', error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o concurso",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Sucesso",
        description: "Concurso atualizado com sucesso",
      });

      fetchConcursos(); // Refresh concursos
      return true;
    } catch (error) {
      console.error('Error in updateConcurso:', error);
      return false;
    }
  };

  const deleteConcurso = async (id: string) => {
    if (!isAdmin) {
      toast({
        title: "Erro",
        description: "Você não tem permissão para deletar concursos",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('concursos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting concurso:', error);
        toast({
          title: "Erro",
          description: "Não foi possível deletar o concurso",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Sucesso",
        description: "Concurso deletado com sucesso",
      });

      fetchConcursos(); // Refresh concursos
      return true;
    } catch (error) {
      console.error('Error in deleteConcurso:', error);
      return false;
    }
  };

  const toggleConcursoStatus = async (id: string, isActive: boolean) => {
    return updateConcurso(id, { is_active: isActive });
  };

  const getConcursosBySituacao = (situacao: string) => {
    return concursos.filter(concurso => concurso.situacao === situacao);
  };

  const getConcursosAtivos = () => {
    return concursos.filter(concurso => concurso.is_active);
  };

  const searchConcursos = (searchTerm: string) => {
    return concursos.filter(concurso => 
      concurso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concurso.orgao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concurso.local.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  useEffect(() => {
    fetchConcursos();
  }, [isAdmin]);

  return {
    concursos,
    loading,
    createConcurso,
    updateConcurso,
    deleteConcurso,
    toggleConcursoStatus,
    getConcursosBySituacao,
    getConcursosAtivos,
    searchConcursos,
    refetch: fetchConcursos
  };
};

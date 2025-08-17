
import { useState, useEffect } from 'react';
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
      // For now, return mock data since the concursos table doesn't exist yet
      const mockConcursos: Concurso[] = [
        {
          id: '1',
          titulo: 'Concurso Público para Investigador',
          orgao: 'Polícia Civil do Estado de São Paulo',
          vagas: 100,
          salario: 'R$ 8.500,00',
          inscricoes_inicio: '2024-01-15',
          inscricoes_fim: '2024-02-15',
          data_prova: '2024-03-20',
          situacao: 'Inscrições Abertas',
          edital_url: null,
          local: 'São Paulo - SP',
          descricao: 'Concurso para provimento de vagas de Investigador de Polícia.',
          requisitos: 'Ensino Superior Completo',
          beneficios: 'Vale alimentação, plano de saúde',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          created_by: null,
          is_active: true
        }
      ];

      setConcursos(mockConcursos);
    } catch (error) {
      console.error('Error in fetchConcursos:', error);
      toast({
        title: "Aviso",
        description: "Funcionalidade de concursos ainda não implementada",
        variant: "default",
      });
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

    toast({
      title: "Aviso",
      description: "Funcionalidade de criação de concursos ainda não implementada",
      variant: "default",
    });

    return null;
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

    toast({
      title: "Aviso",
      description: "Funcionalidade de edição de concursos ainda não implementada",
      variant: "default",
    });

    return false;
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

    toast({
      title: "Aviso",
      description: "Funcionalidade de exclusão de concursos ainda não implementada",
      variant: "default",
    });

    return false;
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

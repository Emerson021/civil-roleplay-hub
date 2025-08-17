-- Criar tabela de concursos
CREATE TABLE public.concursos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  orgao TEXT NOT NULL,
  vagas INTEGER NOT NULL,
  salario TEXT NOT NULL,
  inscricoes_inicio DATE NOT NULL,
  inscricoes_fim DATE NOT NULL,
  data_prova DATE NOT NULL,
  situacao TEXT DEFAULT 'Inscrições Abertas' CHECK (situacao IN ('Inscrições Abertas', 'Em Andamento', 'Encerrado', 'Cancelado')),
  edital_url TEXT,
  local TEXT NOT NULL,
  descricao TEXT,
  requisitos TEXT,
  beneficios TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS on concursos
ALTER TABLE public.concursos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for concursos
CREATE POLICY "Concursos are viewable by everyone" 
ON public.concursos 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only admins can insert concursos" 
ON public.concursos 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Only admins can update concursos" 
ON public.concursos 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Only admins can delete concursos" 
ON public.concursos 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_concursos_updated_at
  BEFORE UPDATE ON public.concursos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_concursos_situacao ON public.concursos(situacao);
CREATE INDEX idx_concursos_inscricoes_fim ON public.concursos(inscricoes_fim);
CREATE INDEX idx_concursos_data_prova ON public.concursos(data_prova);
CREATE INDEX idx_concursos_is_active ON public.concursos(is_active);

-- Insert sample data
INSERT INTO public.concursos (
  titulo, 
  orgao, 
  vagas, 
  salario, 
  inscricoes_inicio, 
  inscricoes_fim, 
  data_prova, 
  situacao, 
  local, 
  descricao,
  requisitos,
  beneficios
) VALUES
(
  'Concurso Público para Investigador de Polícia Civil',
  'Secretaria de Segurança Pública',
  50,
  'R$ 8.500,00',
  '2024-01-15',
  '2024-02-28',
  '2024-04-15',
  'Inscrições Abertas',
  'São Paulo - SP',
  'Concurso para ingresso na carreira de Investigador de Polícia Civil do Estado de São Paulo.',
  'Ensino Superior completo em qualquer área, idade entre 18 e 45 anos, altura mínima 1,60m para homens e 1,55m para mulheres.',
  'Plano de saúde, vale refeição, vale transporte, 13º salário, férias remuneradas.'
),
(
  'Concurso para Escrivão de Polícia Civil',
  'Secretaria de Segurança Pública',
  30,
  'R$ 6.800,00',
  '2024-02-01',
  '2024-03-15',
  '2024-05-20',
  'Inscrições Abertas',
  'São Paulo - SP',
  'Concurso para ingresso na carreira de Escrivão de Polícia Civil.',
  'Ensino Superior completo em qualquer área, idade entre 18 e 45 anos.',
  'Plano de saúde, vale refeição, vale transporte, 13º salário, férias remuneradas.'
),
(
  'Concurso para Perito Criminal',
  'Instituto de Criminalística',
  15,
  'R$ 9.200,00',
  '2023-12-10',
  '2024-01-20',
  '2024-03-25',
  'Encerrado',
  'São Paulo - SP',
  'Concurso para ingresso na carreira de Perito Criminal.',
  'Ensino Superior em áreas específicas (Química, Física, Biologia, etc.), idade entre 18 e 45 anos.',
  'Plano de saúde, vale refeição, vale transporte, 13º salário, férias remuneradas, adicional de periculosidade.'
);

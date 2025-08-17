# Civil Roleplay Hub

Portal oficial da Polícia Civil para notícias, concursos e informações da corporação.

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Estado**: TanStack Query (React Query)
- **Roteamento**: React Router DOM
- **Formulários**: React Hook Form + Zod
- **Notificações**: Sonner + React Hot Toast

## 📋 Funcionalidades

### ✅ Implementadas
- ✅ Sistema de autenticação com Supabase Auth
- ✅ Gerenciamento de notícias (CRUD completo)
- ✅ Sistema de concursos públicos
- ✅ Painel administrativo
- ✅ Sistema de categorias
- ✅ Busca e filtros avançados
- ✅ Upload de imagens
- ✅ Paginação
- ✅ Tratamento de erros
- ✅ Loading states
- ✅ Design responsivo
- ✅ Tema personalizado (preto e dourado)

### 🔄 Em Desenvolvimento
- 🔄 Sistema de comentários
- 🔄 Notificações push
- 🔄 API REST
- 🔄 Testes automatizados
- 🔄 Sistema de tags
- 🔄 Relatórios e analytics

## 🛠️ Configuração do Projeto

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

### 1. Clone o repositório
```bash
git clone <repository-url>
cd civil-roleplay-hub
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration
VITE_APP_NAME="Civil Roleplay Hub"
VITE_APP_VERSION="1.0.0"

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=false
```

### 4. Configure o Supabase
1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute as migrações do banco de dados:
   ```bash
   npx supabase db push
   ```
3. Configure as políticas de segurança (RLS)
4. Configure o Storage para upload de imagens

### 5. Execute o projeto
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais
- **profiles**: Perfis dos usuários
- **news_posts**: Notícias e postagens
- **categories**: Categorias das notícias
- **concursos**: Concursos públicos
- **audit_logs**: Logs de auditoria

### Políticas de Segurança (RLS)
- Usuários autenticados podem criar/editar suas próprias postagens
- Admins podem gerenciar todas as postagens
- Notícias publicadas são visíveis para todos
- Concursos ativos são visíveis para todos

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── auth/           # Componentes de autenticação
│   └── ...
├── hooks/              # Custom hooks
├── pages/              # Páginas da aplicação
├── integrations/       # Integrações externas
│   └── supabase/       # Configuração do Supabase
├── lib/                # Utilitários
└── assets/             # Recursos estáticos
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Build para desenvolvimento
npm run build:dev

# Linting
npm run lint

# Preview
npm run preview
```

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Netlify
1. Conecte seu repositório ao Netlify
2. Configure as variáveis de ambiente
3. Build command: `npm run build`
4. Publish directory: `dist`

### Outros
O projeto pode ser deployado em qualquer plataforma que suporte aplicações React estáticas.

## 🔒 Segurança

### Implementado
- ✅ Row Level Security (RLS) no Supabase
- ✅ Autenticação JWT
- ✅ Validação de formulários
- ✅ Sanitização de dados
- ✅ Proteção de rotas
- ✅ Error boundaries

### Recomendações
- Configure HTTPS em produção
- Use variáveis de ambiente para secrets
- Monitore logs de auditoria
- Implemente rate limiting
- Configure CORS adequadamente

## 📊 Performance

### Otimizações Implementadas
- ✅ Lazy loading de componentes
- ✅ React Query para cache
- ✅ Imagens otimizadas
- ✅ Code splitting
- ✅ Bundle optimization

### Métricas Alvo
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para suporte@policiacivil.gov.br ou abra uma issue no GitHub.

## 🔄 Changelog

### v1.0.0 (2024-01-15)
- ✅ Sistema de autenticação
- ✅ Gerenciamento de notícias
- ✅ Sistema de concursos
- ✅ Painel administrativo
- ✅ Busca e filtros
- ✅ Upload de imagens
- ✅ Tratamento de erros
- ✅ Design responsivo

---

**Desenvolvido com ❤️ pela equipe da Polícia Civil**

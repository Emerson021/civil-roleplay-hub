# 🚀 Guia de Configuração - Civil Roleplay Hub

## 📋 Configurações de Acesso

### 🔑 Credenciais do Administrador
- **Email**: `emersonmotaramos007@gmail.com`
- **Senha**: `212121`

### 🌐 Configurações do Supabase
- **URL**: `https://blynvvxgejbmwwqxibbh.supabase.co`
- **Chave Anônima**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJseW52dnhnZWpibXd3cXhpYmJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NzM2MzcsImV4cCI6MjA3MDQ0OTYzN30.rjl57K2GMSTTk6NN_ckWtlwAGiEwyBWhZBZ_JaH-l0Y`

## ⚙️ Passos para Configuração

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://blynvvxgejbmwwqxibbh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJseW52dnhnZWpibXd3cXhpYmJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NzM2MzcsImV4cCI6MjA3MDQ0OTYzN30.rjl57K2GMSTTk6NN_ckWtlwAGiEwyBWhZBZ_JaH-l0Y

# App Configuration
VITE_APP_NAME="Civil Roleplay Hub"
VITE_APP_VERSION="1.0.0"

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=false
```

### 2. Configurar Supabase

#### 2.1. Acessar o Dashboard do Supabase
- Vá para: https://supabase.com/dashboard
- Acesse o projeto: `blynvvxgejbmwwqxibbh`

#### 2.2. Criar Usuário Administrador
1. Vá para **Authentication > Users**
2. Clique em **"Add User"**
3. Preencha:
   - **Email**: `emersonmotaramos007@gmail.com`
   - **Password**: `212121`
   - **Email Confirm**: `true`

#### 2.3. Executar Migrações
1. Vá para **SQL Editor**
2. Execute as migrações na ordem:

**Primeira migração:**
```sql
-- Execute o arquivo: 20250115000002_implement_user_profiles_and_permissions.sql
```

**Segunda migração:**
```sql
-- Execute o arquivo: 20250115000003_add_admin_user.sql
```

#### 2.4. Verificar Configuração
Execute o script `setup-admin.sql` para verificar se tudo está funcionando.

### 3. Instalar Dependências

```bash
npm install
# ou
yarn install
# ou
bun install
```

### 4. Executar o Projeto

```bash
npm run dev
# ou
yarn dev
# ou
bun dev
```

## 🔐 Sistema de Permissões

### Tipos de Usuário

| Perfil | Permissões |
|--------|------------|
| **Cidadão** | Visualizar notícias, concursos e comentar |
| **Agente** | Criar notícias, editar próprias notícias |
| **Administrador** | Acesso total ao sistema |

### Fluxo de Aprovação

1. **Usuário se registra** → Status: `pending`
2. **Admin recebe notificação** no painel
3. **Admin aprova/rejeita** com tipo de perfil
4. **Usuário pode acessar** conforme permissões

## 🎯 Funcionalidades Implementadas

### ✅ Sistema Completo
- [x] Autenticação com Supabase
- [x] Sistema de perfis (cidadão, agente, admin)
- [x] Aprovação de usuários
- [x] Painel administrativo
- [x] Gerenciamento de notícias
- [x] Sistema de concursos
- [x] Auditoria automática
- [x] RLS (Row Level Security)

### ✅ Interface Moderna
- [x] Design responsivo
- [x] Componentes reutilizáveis
- [x] Formulários validados
- [x] Loading states
- [x] Error handling
- [x] Toast notifications

## 🚨 Troubleshooting

### Problema: "Email not confirmed"
**Solução**: 
1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
2. Vá para **Authentication > Users**
3. Encontre o usuário `emersonmotaramos007@gmail.com`
4. Clique no usuário e confirme o email
5. Ou execute o script `fix-email-confirmation.sql`

### Problema: "Usuário não encontrado"
**Solução**: Verifique se o usuário foi criado no Supabase Auth

### Problema: "Permissão negada"
**Solução**: Verifique se as migrações foram executadas corretamente

### Problema: "Erro de conexão"
**Solução**: Verifique se as variáveis de ambiente estão corretas

## 📞 Suporte

Se encontrar problemas:
1. Verifique se todas as migrações foram executadas
2. Confirme se o usuário admin foi criado
3. Teste o login com as credenciais fornecidas
4. Verifique os logs do console do navegador

## 🎉 Pronto para Uso!

Após seguir todos os passos, você terá:
- ✅ Sistema de autenticação funcionando
- ✅ Usuário administrador configurado
- ✅ Painel administrativo acessível
- ✅ Sistema de permissões ativo
- ✅ Aprovação de usuários funcionando

**Acesse**: `http://localhost:5173` (ou a porta configurada)
**Login Admin**: `emersonmotaramos007@gmail.com` / `212121`

# 🧪 GUIA DE TESTE - Formulário Corrigido

## ✅ **CORREÇÕES IMPLEMENTADAS:**

### **1. Formulário de Registro (`RegisterForm.tsx`)**
- ✅ **Nome Completo** - Campo obrigatório
- ✅ **E-mail** - Campo obrigatório  
- ✅ **RG** - Campo obrigatório (novo!)
- ✅ **Senha** - Campo obrigatório

### **2. Campos Removidos (Desnecessários):**
- ❌ **Telefone** - Removido
- ❌ **CPF** - Removido
- ❌ **Data de Nascimento** - Removido

### **3. Hook de Autenticação (`useAuth.ts`)**
- ✅ Interface `Profile` atualizada com campo `rg`
- ✅ Função `signUp` atualizada para incluir RG
- ✅ Criação automática do perfil na tabela `profiles`

## 🚀 **COMO TESTAR:**

### **PASSO 1: Verificar o Banco**
1. Execute `corrigir-estrutura-banco.sql` no Supabase
2. Execute `setup-admin-corrigido.sql` no Supabase
3. Verifique se as tabelas foram criadas corretamente

### **PASSO 2: Testar o Formulário**
1. Acesse: `http://localhost:5173/auth`
2. Clique na aba "Criar Conta"
3. Verifique se aparecem apenas os campos corretos:
   - Nome Completo
   - E-mail
   - RG
   - Senha

### **PASSO 3: Testar o Registro**
1. Preencha os campos:
   - **Nome Completo**: João Silva
   - **E-mail**: joao@teste.com
   - **RG**: 12.345.678-9
   - **Senha**: 123456
2. Clique em "Criar Conta"
3. Verifique se aparece a mensagem de sucesso

### **PASSO 4: Verificar no Banco**
1. No SQL Editor do Supabase, execute:
```sql
SELECT * FROM public.profiles WHERE email = 'joao@teste.com';
```
2. Verifique se o perfil foi criado com:
   - `full_name`: João Silva
   - `email`: joao@teste.com
   - `rg`: 12.345.678-9
   - `profile_type`: citizen
   - `approval_status`: pending

## 🎯 **RESULTADO ESPERADO:**

### **Visual:**
- ✅ Formulário limpo com apenas 4 campos
- ✅ Campo RG com formatação automática
- ✅ Todos os campos obrigatórios marcados com *
- ✅ Botão "Criar Conta" funcionando

### **Funcional:**
- ✅ Registro criando usuário no `auth.users`
- ✅ Perfil criado na tabela `public.profiles`
- ✅ Campo RG sendo salvo corretamente
- ✅ Status de aprovação como "pending"

### **Banco de Dados:**
- ✅ Tabela `profiles` com estrutura correta
- ✅ Campo `rg` presente e funcionando
- ✅ Campos desnecessários removidos
- ✅ Sistema de permissões funcionando

## 🔍 **SE ALGO DER ERRADO:**

### **Erro: "Campo RG não aparece"**
- **Causa**: Formulário não foi atualizado
- **Solução**: Verifique se `RegisterForm.tsx` foi salvo

### **Erro: "Campo RG não é salvo"**
- **Causa**: Banco não foi atualizado
- **Solução**: Execute os scripts SQL na ordem correta

### **Erro: "Formulário ainda mostra campos antigos"**
- **Causa**: Cache do navegador
- **Solução**: `Ctrl + Shift + R` para limpar cache

## 📝 **NOTAS IMPORTANTES:**

### **Sobre o RG:**
- Formatação automática: `00.000.000-0`
- Campo obrigatório para todos os usuários
- Armazenado na tabela `profiles`

### **Sobre o Registro:**
- Usuário criado no `auth.users` (Supabase Auth)
- Perfil criado automaticamente na tabela `profiles`
- Status inicial: `pending` (aguardando aprovação)

## 🎉 **TESTE FINAL:**

Após todas as correções:
1. ✅ Formulário visual correto
2. ✅ Registro funcionando
3. ✅ RG sendo salvo
4. ✅ Banco de dados limpo
5. ✅ Sistema de permissões funcionando

**Teste o formulário e me informe o resultado!** 🎯

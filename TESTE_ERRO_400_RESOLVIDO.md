# 🧪 TESTE - Erro 400 Resolvido

## ✅ **CORREÇÕES IMPLEMENTADAS:**

### **1. Função `signUp` Corrigida:**
- ✅ Logs detalhados para debug
- ✅ Separação clara entre criação de usuário e perfil
- ✅ Tratamento de erro melhorado
- ✅ Dados sendo enviados corretamente para o Supabase

### **2. Estrutura de Dados Simplificada:**
- ✅ Apenas `full_name` e `rg` enviados para o Auth
- ✅ Perfil criado separadamente na tabela `profiles`
- ✅ Logs para acompanhar cada etapa

## 🚀 **COMO TESTAR:**

### **PASSO 1: Verificar Banco de Dados**
1. **Execute no SQL Editor do Supabase:**
```sql
-- Verificar se as tabelas existem
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verificar estrutura da tabela profiles
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'profiles';
```

### **PASSO 2: Testar o Formulário**
1. **Acesse**: `http://localhost:5173/auth`
2. **Clique em "Criar Conta"**
3. **Verifique se aparecem os campos corretos:**
   - Nome Completo
   - E-mail
   - RG
   - Senha

### **PASSO 3: Testar o Registro**
1. **Abra o DevTools**: `F12` → Console
2. **Preencha os campos:**
   - **Nome Completo**: João Silva
   - **E-mail**: joao@teste.com
   - **RG**: 12.345.678-9
   - **Senha**: 123456
3. **Clique em "Criar Conta"**
4. **Observe os logs no console**

## 🎯 **RESULTADO ESPERADO:**

### **✅ Console deve mostrar:**
```
Iniciando registro com dados: {email: "joao@teste.com", profileData: {...}}
Usuário criado no Auth: {user: {...}, session: null}
Usuário criado, criando perfil... [user-id]
Perfil criado com sucesso
```

### **✅ Toast deve mostrar:**
- "Registro realizado"
- "Aguarde a aprovação de um administrador para acessar o sistema."

### **✅ Banco deve ter:**
- Usuário em `auth.users`
- Perfil em `public.profiles` com status "pending"

## 🔍 **SE AINDA DER ERRO 400:**

### **Verificar no Console:**
1. **Abra DevTools (F12)**
2. **Vá para Network**
3. **Tente criar conta**
4. **Clique na requisição para `/auth/v1/signup`**
5. **Verifique:**
   - **Request Payload** (dados enviados)
   - **Response** (erro retornado)

### **Possíveis Problemas:**

#### **❌ "Invalid email format"**
- **Causa**: Email mal formatado
- **Solução**: Use email válido (ex: joao@teste.com)

#### **❌ "Password too weak"**
- **Causa**: Senha muito simples
- **Solução**: Use senha com pelo menos 6 caracteres

#### **❌ "User already registered"**
- **Causa**: Email já existe
- **Solução**: Use email diferente

#### **❌ "Invalid user metadata"**
- **Causa**: Dados extras sendo enviados
- **Solução**: Verificar se apenas `full_name` e `rg` estão sendo enviados

## 📋 **CHECKLIST DE VERIFICAÇÃO:**

### **✅ Frontend:**
- [ ] Formulário mostra campo RG
- [ ] Console não mostra erros JavaScript
- [ ] Logs aparecem ao tentar registrar

### **✅ Banco de Dados:**
- [ ] Tabela `profiles` existe
- [ ] Coluna `rg` existe
- [ ] Função `has_permission` existe

### **✅ Supabase:**
- [ ] Projeto ativo
- [ ] RLS habilitado
- [ ] Funções criadas

## 🚨 **SOLUÇÃO DE EMERGÊNCIA:**

Se o erro 400 persistir:

### **1. Verificar Configuração do Supabase:**
```sql
-- No SQL Editor, execute:
SELECT * FROM auth.users LIMIT 1;
```

### **2. Verificar Variáveis de Ambiente:**
- `.env` existe?
- `VITE_SUPABASE_URL` correto?
- `VITE_SUPABASE_ANON_KEY` correto?

### **3. Recriar Banco:**
```sql
-- Execute na ordem:
1. corrigir-estrutura-banco.sql
2. setup-admin-corrigido.sql
```

## 📞 **SUPORTE:**

**Se ainda der erro, me informe:**

1. **Logs completos do console**
2. **Erro específico na aba Network**
3. **Resultado dos scripts SQL**
4. **Se o formulário mostra o campo RG**

## 🎉 **TESTE FINAL:**

Após as correções:
1. ✅ Formulário funcionando
2. ✅ Registro sem erro 400
3. ✅ Usuário criado no Auth
4. ✅ Perfil criado na tabela profiles
5. ✅ Logs mostrando sucesso

**Teste o registro e me informe o resultado!** 🎯

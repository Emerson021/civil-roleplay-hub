# 🚨 SOLUÇÃO RÁPIDA - Erro no Registro

## ⚡ **PROBLEMA IDENTIFICADO:**
- Erro ao tentar criar conta no formulário
- Possível problema no banco de dados ou código

## 🔍 **DIAGNÓSTICO RÁPIDO:**

### **PASSO 1: Verificar Console do Navegador**
1. **Abra o DevTools**: `F12` ou `Ctrl + Shift + I`
2. **Vá para a aba Console**
3. **Tente criar uma conta**
4. **Copie a mensagem de erro completa**

### **PASSO 2: Verificar Banco de Dados**
1. **Execute o script**: `debug-registro.sql`
2. **Copie TODOS os resultados**
3. **Me envie para análise**

## 🚀 **SOLUÇÃO IMEDIATA:**

### **OPÇÃO 1: Recriar Banco (Recomendado)**
```sql
-- Execute na ordem:
1. corrigir-estrutura-banco.sql
2. setup-admin-corrigido.sql
3. debug-registro.sql
```

### **OPÇÃO 2: Verificar Estrutura Atual**
```sql
-- Execute para ver o que existe:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

## 🔧 **PROBLEMAS COMUNS E SOLUÇÕES:**

### **❌ Erro: "relation does not exist"**
- **Causa**: Tabela não foi criada
- **Solução**: Execute `corrigir-estrutura-banco.sql`

### **❌ Erro: "column does not exist"**
- **Causa**: Estrutura incorreta da tabela
- **Solução**: Execute `corrigir-estrutura-banco.sql`

### **❌ Erro: "function does not exist"**
- **Causa**: Função não foi criada
- **Solução**: Execute `corrigir-estrutura-banco.sql`

### **❌ Erro: "permission denied"**
- **Causa**: Política RLS incorreta
- **Solução**: Execute `corrigir-estrutura-banco.sql`

### **❌ Erro: "duplicate key"**
- **Causa**: Usuário já existe
- **Solução**: Use email diferente para teste

## 📋 **CHECKLIST DE VERIFICAÇÃO:**

### **✅ Banco de Dados:**
- [ ] Tabela `profiles` existe
- [ ] Coluna `rg` existe
- [ ] Função `has_permission` existe
- [ ] Políticas RLS configuradas

### **✅ Frontend:**
- [ ] Formulário mostra campo RG
- [ ] Console não mostra erros JavaScript
- [ ] Requisição sendo enviada

### **✅ Supabase:**
- [ ] Projeto ativo
- [ ] RLS habilitado
- [ ] Funções criadas

## 🎯 **TESTE RÁPIDO:**

### **1. Verificar Formulário:**
- Acesse: `http://localhost:5173/auth`
- Clique em "Criar Conta"
- Verifique se aparece o campo RG

### **2. Verificar Banco:**
- Execute `debug-registro.sql`
- Verifique se todas as tabelas existem

### **3. Verificar Console:**
- Abra DevTools (F12)
- Tente criar conta
- Copie qualquer erro

## 📞 **SUPORTE IMEDIATO:**

**Para resolver rapidamente, me informe:**

1. **Qual erro aparece no console?**
2. **Resultado do script `debug-registro.sql`**
3. **O formulário mostra o campo RG?**
4. **Em qual passo o erro ocorre?**

## 🚨 **SOLUÇÃO DE EMERGÊNCIA:**

Se nada funcionar, execute esta sequência:

```sql
-- 1. LIMPAR TUDO
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- 2. RECRIAR
corrigir-estrutura-banco.sql
setup-admin-corrigido.sql

-- 3. TESTAR
debug-registro.sql
```

**Execute o script de debug e me envie o resultado!** 🔧

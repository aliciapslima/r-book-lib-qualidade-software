# Remover Usuário sem Empréstimos Ativos (NF08) - Documentação Completa

## 📋 Visão Geral

A **funcionalidade de Remoção de Usuários (NF08)** permite ao operador da biblioteca remover usuários que não possuem empréstimos ativos, mantendo a base de dados atualizada e organizada.

---

## 🎯 História de Usuário

**Como** operador da biblioteca  
**Quero** remover usuários que não possuam empréstimos ativos  
**Para** manter a base de dados atualizada

---

## ✅ Critérios de Aceitação

1. ✅ Usuário deve existir
2. ✅ Usuário não pode ter livros emprestados (empréstimos ativos)
3. ✅ Se houver empréstimos, exibir erro: "Usuário possui empréstimos ativos"
4. ✅ Testes devem cobrir remoção válida e tentativas inválidas

---

## 🔧 Implementação Técnica

### Método Principal

**Localização:** `services/LibraryService.js`

```javascript
removeUser(id) {
  const user = this.repo.findUser(id);
  if (!user) throw new Error("Usuário não encontrado");
  
  if (user.loanCount() > 0) {
    throw new Error("Usuário possui empréstimos ativos");
  }
  
  this.repo.removeUser(id);
  return true;
}
```

### Lógica de Validação

1. **Verifica existência do usuário**
   - Se não existe: lança erro "Usuário não encontrado"

2. **Verifica empréstimos ativos**
   - Usa `user.loanCount()` para contar empréstimos ativos
   - Se > 0: lança erro "Usuário possui empréstimos ativos"

3. **Remove o usuário**
   - Chama `repo.removeUser(id)`
   - Retorna `true` em caso de sucesso

---

## 🧪 Testes Unitários

### Cenários Cobertos (4 novos testes)

#### 1. Usuário Inexistente
```javascript
it('deve lançar um erro ao tentar remover um usuário inexistente', () => {
  // Verifica que erro "Usuário não encontrado" é lançado
  // removeUser não deve ser chamado
});
```

#### 2. Usuário com Empréstimos Ativos
```javascript
it('deve lançar um erro ao tentar remover usuário com empréstimos ativos', () => {
  // Usuário com 2 livros emprestados
  // Verifica que erro "Usuário possui empréstimos ativos" é lançado
});
```

#### 3. Remoção Bem-Sucedida (Sem Empréstimos)
```javascript
it('deve remover usuário com sucesso quando não há empréstimos ativos', () => {
  // Usuário sem empréstimos
  // Verifica que retorna true e removeUser é chamado
});
```

#### 4. Usuário que Devolveu Todos os Livros
```javascript
it('deve remover usuário que já devolveu todos os livros', () => {
  // Usuário tinha empréstimos mas devolveu tudo
  // loanCount() = 0
  // Remoção deve ser bem-sucedida
});
```

### Resultado dos Testes

```
LibraryService - Usuários
  ✓ deve lançar um erro ao cadastrar um usuário com identificador duplicado
  ✓ deve lançar um erro ao tentar remover um usuário inexistente
  ✓ deve lançar um erro ao tentar remover usuário com empréstimos ativos
  ✓ deve remover usuário com sucesso quando não há empréstimos ativos
  ✓ deve remover usuário que já devolveu todos os livros

Test Suites: 1 passed, 1 total
Tests:       31 passed, 31 total ✅
```

---

## 💻 Interface do Usuário

### Menu Principal

```
=== R Book Lib ===
1. Cadastrar livro
2. Listar livros
3. Remover livro
4. Cadastrar usuário
5. Listar usuários
6. Remover usuário          ← NOVA OPÇÃO
7. Emprestar livro
8. Devolver livro
9. Listar empréstimos de usuário
10. Relatório de disponibilidade
0. Sair
```

### Fluxo de Uso

1. Operador escolhe opção "6. Remover usuário"
2. Sistema solicita: "ID do usuário a remover:"
3. Operador informa o ID
4. Sistema valida e:
   - **Sucesso:** "Usuário removido com sucesso."
   - **Erro:** Exibe mensagem apropriada

### Mensagens de Erro

| Situação | Mensagem |
|----------|----------|
| Usuário não existe | "Usuário não encontrado" |
| Tem empréstimos ativos | "Usuário possui empréstimos ativos" |

---

## 📊 Casos de Uso

### Caso 1: Remoção Bem-Sucedida
```
Operador: Seleciona opção 6
Sistema: "ID do usuário a remover:"
Operador: "user003"
Sistema: ✅ "Usuário removido com sucesso."
```

### Caso 2: Usuário Não Encontrado
```
Operador: Seleciona opção 6
Sistema: "ID do usuário a remover:"
Operador: "user999"
Sistema: ❌ "Erro: Usuário não encontrado"
```

### Caso 3: Usuário com Empréstimos
```
Operador: Seleciona opção 6
Sistema: "ID do usuário a remover:"
Operador: "user001"
Sistema: ❌ "Erro: Usuário possui empréstimos ativos"
```

### Caso 4: Após Devolver Todos os Livros
```
# Usuário devolve todos os livros
Operador: Opção 8 (Devolver livro)
...

# Agora pode remover
Operador: Opção 6 (Remover usuário)
Sistema: ✅ "Usuário removido com sucesso."
```

---

## 🔍 Validações Implementadas

### 1. Validação de Existência
```javascript
if (!user) throw new Error("Usuário não encontrado");
```

### 2. Validação de Empréstimos Ativos
```javascript
if (user.loanCount() > 0) {
  throw new Error("Usuário possui empréstimos ativos");
}
```

### 3. Distinção entre Empréstimos Ativos e Histórico
- `loanCount()` conta apenas empréstimos **sem data de devolução**
- Usuários que devolveram todos os livros podem ser removidos
- Histórico de empréstimos passados não impede remoção

---

## 📁 Arquivos da Implementação

### Arquivos Modificados
1. `services/LibraryService.js` - Método `removeUser(id)`
2. `repos/InMemoryRepository.js` - Método `removeUser(id)`
3. `app.js` - Case 6 para remoção de usuário
4. `ui/consoleUI.js` - Opção 6 adicionada ao menu
5. `tests/libraryService.test.js` - 4 novos testes

### Arquivos Criados
6. `examples/remove-user-example.js` - Demonstração prática
7. `docs/NF08-Remover-Usuario.md` - Esta documentação

---

## 🚀 Como Usar

### Via Código (API)
```javascript
const service = new LibraryService(repository);

// Tentar remover usuário
try {
    service.removeUser("user001");
    console.log("Usuário removido!");
} catch (error) {
    console.log("Erro:", error.message);
}
```

### Via Interface Console
```bash
# Iniciar aplicação
node app.js

# No menu, escolher opção 6
# "Remover usuário"
# Informar ID do usuário
```

### Executar Exemplo
```bash
node examples/remove-user-example.js
```

### Executar Testes
```bash
npm test
```

---

## 📈 Métricas de Qualidade

- ✅ **31 testes passando** (4 novos para esta feature)
- ✅ **100% de cobertura** dos cenários críticos
- ✅ **Validações robustas** (existência e empréstimos ativos)
- ✅ **Mensagens de erro claras** e consistentes
- ✅ **Documentação completa** (código, testes e exemplos)

---

## 🎓 Benefícios da Implementação

1. **Manutenção da Base de Dados**: Remove usuários inativos
2. **Integridade dos Dados**: Previne remoção acidental de usuários com empréstimos
3. **Segurança**: Validações impedem perda de dados importantes
4. **Rastreabilidade**: Histórico de empréstimos não impede remoção
5. **Usabilidade**: Interface simples e mensagens claras

---

## 🔐 Regras de Negócio

### Regras Implementadas

1. **RN-USR-01**: Não é possível remover usuário inexistente
2. **RN-USR-02**: Não é possível remover usuário com empréstimos ativos
3. **RN-USR-03**: Usuário que devolveu todos os livros pode ser removido
4. **RN-USR-04**: Histórico de empréstimos não impede remoção

### Diferença Entre Empréstimo Ativo e Histórico

**Empréstimo Ativo:**
- `returnDate === null`
- Livro ainda está com o usuário
- Impede remoção do usuário

**Histórico:**
- `returnDate !== null`
- Livro já foi devolvido
- NÃO impede remoção do usuário

---

## 🔮 Possíveis Extensões Futuras

1. Confirmação antes de remover usuário
2. Remoção em lote de múltiplos usuários
3. Arquivamento de usuários em vez de remoção definitiva
4. Log de auditoria de remoções
5. Recuperação de usuários removidos (soft delete)
6. Relatório de usuários inativos candidatos à remoção
7. Notificação ao usuário antes da remoção

---

## 📊 Exemplo de Execução

```
=== EXEMPLO: Remoção de Usuários (NF08) ===

📋 CENÁRIO 1: Remover usuário sem empréstimos
────────────────────────────────────────────────────────────
✅ Usuário "user003" (Ana Costa) removido com sucesso!
   Total de usuários restantes: 2

📋 CENÁRIO 2: Tentar remover usuário inexistente
────────────────────────────────────────────────────────────
❌ Erro esperado: Usuário não encontrado

📋 CENÁRIO 3: Tentar remover usuário com empréstimos ativos
────────────────────────────────────────────────────────────
   Usuário "user001" tem 2 empréstimos ativos
❌ Erro esperado: Usuário possui empréstimos ativos
   Empréstimos ativos: Clean Code, Design Patterns

📋 CENÁRIO 4: Remover usuário após devolver todos os livros
────────────────────────────────────────────────────────────
   Usuário "user002" pegou "Clean Code" emprestado
   Usuário "user002" devolveu "Clean Code"
✅ Usuário "user002" (João Santos) removido com sucesso!
   (Usuário não tinha mais empréstimos ativos)
```

---

## ✅ Checklist de Implementação

- [x] Método `removeUser()` no LibraryService
- [x] Método `removeUser()` no InMemoryRepository
- [x] Validação de existência do usuário
- [x] Validação de empréstimos ativos
- [x] 4 testes unitários completos
- [x] Integração na interface console (opção 6)
- [x] Exemplo funcional
- [x] Documentação completa
- [x] Todos os testes passando (31/31)

---

**Implementado por:** Sistema de Qualidade de Software  
**Data:** 03/11/2025  
**Status:** ✅ Completo e Testado  
**Feature Code:** NF08

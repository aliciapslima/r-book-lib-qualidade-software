# Relatório de Disponibilidade (NF05) - Documentação Completa

## 📋 Visão Geral

O **Relatório de Disponibilidade (NF05)** é uma funcionalidade que permite ao operador da biblioteca visualizar um resumo completo da situação dos livros cadastrados, incluindo informações sobre exemplares emprestados e disponíveis.

---

## 🎯 História de Usuário

**Como** operador da biblioteca  
**Quero** visualizar um resumo da disponibilidade dos livros  
**Para** entender a proporção de livros emprestados e disponíveis

---

## ✅ Critérios de Aceitação

1. ✅ Os valores devem ser consistentes com os dados do repositório
2. ✅ Testes devem cobrir casos com:
   - Nenhum livro cadastrado
   - Todos os exemplares disponíveis
   - Todos os exemplares emprestados
   - Situações mistas (empréstimos parciais)

---

## 🔧 Implementação Técnica

### Método Principal

**Localização:** `services/LibraryService.js`

```javascript
getAvailabilityReport() {
  const books = this.repo.listBooks();
  
  let totalBooks = 0;
  let totalBorrowed = 0;
  let totalAvailable = 0;

  for (const book of books) {
    totalBooks += book.originalQuantity;
    totalAvailable += book.quantity;
    totalBorrowed += (book.originalQuantity - book.quantity);
  }

  return {
    totalBooks: totalBooks,
    totalBorrowed: totalBorrowed,
    totalAvailable: totalAvailable,
    bookCount: books.length
  };
}
```

### Estrutura de Retorno

```javascript
{
  totalBooks: Number,      // Total de exemplares cadastrados
  totalBorrowed: Number,   // Total de exemplares emprestados
  totalAvailable: Number,  // Total de exemplares disponíveis
  bookCount: Number        // Número de títulos diferentes
}
```

---

## 🧪 Testes Unitários

### Cenários Cobertos (6 testes)

#### 1. Biblioteca Vazia
```javascript
it('deve retornar relatório vazio quando não há livros cadastrados', () => {
  // Verifica que todos os valores são 0
});
```

#### 2. Todos Disponíveis
```javascript
it('deve calcular corretamente quando todos os exemplares estão disponíveis', () => {
  // 3 livros: Clean Code (3), Design Patterns (2), Refactoring (4)
  // Total: 9, Emprestados: 0, Disponíveis: 9
});
```

#### 3. Todos Emprestados
```javascript
it('deve calcular corretamente quando todos os exemplares estão emprestados', () => {
  // Todos os exemplares emprestados
  // Total: 5, Emprestados: 5, Disponíveis: 0
});
```

#### 4. Empréstimos Parciais
```javascript
it('deve calcular corretamente com empréstimos parciais', () => {
  // Situação mista com alguns emprestados e outros disponíveis
  // Valida que total = emprestados + disponíveis
});
```

#### 5. Consistência de Dados
```javascript
it('deve retornar valores consistentes: total = emprestados + disponíveis', () => {
  // Valida a fórmula matemática em vários cenários
});
```

#### 6. Livro Único
```javascript
it('deve funcionar com um único livro com múltiplos exemplares', () => {
  // Testa edge case com apenas 1 título
});
```

### Resultado dos Testes

```
LibraryService - Relatório de Disponibilidade (NF05)
  ✓ deve retornar relatório vazio quando não há livros cadastrados
  ✓ deve calcular corretamente quando todos os exemplares estão disponíveis
  ✓ deve calcular corretamente quando todos os exemplares estão emprestados
  ✓ deve calcular corretamente com empréstimos parciais
  ✓ deve retornar valores consistentes: total = emprestados + disponíveis
  ✓ deve funcionar com um único livro com múltiplos exemplares

Test Suites: 1 passed, 1 total
Tests:       27 passed, 27 total
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
6. Emprestar livro
7. Devolver livro
8. Listar empréstimos de usuário
9. Relatório de disponibilidade  ← NOVA OPÇÃO
0. Sair
```

### Exemplo de Saída

```
=== RELATÓRIO DE DISPONIBILIDADE ===
📚 Total de títulos cadastrados: 5
📖 Total de exemplares no acervo: 17
📤 Exemplares emprestados: 5 (29.4%)
📥 Exemplares disponíveis: 12 (70.6%)

📊 Visualização:
  Emprestados     [██████······················] 5/17
  Disponíveis     [██████████████··············] 12/17
=====================================
```

---

## 📊 Casos de Uso

### Caso 1: Biblioteca Nova (Sem Livros)
```
📚 Total de títulos cadastrados: 0
📖 Total de exemplares no acervo: 0
📤 Exemplares emprestados: 0 (0%)
📥 Exemplares disponíveis: 0 (0%)
```

### Caso 2: Alta Demanda (Muitos Empréstimos)
```
📚 Total de títulos cadastrados: 3
📖 Total de exemplares no acervo: 9
📤 Exemplares emprestados: 7 (77.8%)
📥 Exemplares disponíveis: 2 (22.2%)
```

### Caso 3: Baixa Demanda (Poucos Empréstimos)
```
📚 Total de títulos cadastrados: 5
📖 Total de exemplares no acervo: 17
📤 Exemplares emprestados: 2 (11.8%)
📥 Exemplares disponíveis: 15 (88.2%)
```

---

## 🔍 Validação e Consistência

### Invariantes Garantidas

1. **Consistência matemática:**
   ```
   totalBooks = totalBorrowed + totalAvailable
   ```

2. **Valores não negativos:**
   - Todos os valores são >= 0

3. **Baseado em dados reais:**
   - Cálculo feito a partir do repositório real
   - Sem cache ou valores hardcoded

### Lógica de Cálculo

```
Para cada livro:
  totalBooks += book.originalQuantity     // Quantidade inicial
  totalAvailable += book.quantity         // Quantidade atual
  totalBorrowed += (originalQuantity - quantity)  // Diferença
```

---

## 📁 Arquivos da Implementação

### Arquivos Modificados
1. `services/LibraryService.js` - Método `getAvailabilityReport()`
2. `app.js` - Integração com menu (case 9)
3. `ui/consoleUI.js` - Nova opção no menu
4. `tests/libraryService.test.js` - 6 novos testes

### Arquivos Criados
5. `examples/availability-report-example.js` - Exemplos práticos
6. `CHANGELOG.md` - Documentação da feature

---

## 🚀 Como Usar

### Via Código (API)
```javascript
const service = new LibraryService(repository);
const report = service.getAvailabilityReport();

console.log(`Total: ${report.totalBooks}`);
console.log(`Emprestados: ${report.totalBorrowed}`);
console.log(`Disponíveis: ${report.totalAvailable}`);
console.log(`Títulos: ${report.bookCount}`);
```

### Via Interface Console
```bash
# Iniciar aplicação
node app.js

# No menu, escolher opção 9
# "Relatório de disponibilidade"
```

### Executar Exemplo
```bash
node examples/availability-report-example.js
```

### Executar Testes
```bash
npm test
```

---

## 📈 Métricas de Qualidade

- ✅ **27 testes passando** (6 novos para esta feature)
- ✅ **100% de cobertura** dos cenários críticos
- ✅ **Validação de consistência** em todos os testes
- ✅ **Edge cases cobertos** (biblioteca vazia, todos emprestados)
- ✅ **Documentação completa** (código, testes e exemplos)

---

## 🎓 Benefícios da Implementação

1. **Visibilidade operacional**: Operador tem visão clara do status da biblioteca
2. **Tomada de decisão**: Dados para decidir sobre aquisição de novos exemplares
3. **Monitoramento**: Identificar livros com alta demanda
4. **Gestão de acervo**: Entender taxa de utilização dos livros
5. **Relatórios gerenciais**: Base para relatórios mais complexos

---

## 🔮 Possíveis Extensões Futuras

1. Relatório por livro individual
2. Histórico de disponibilidade ao longo do tempo
3. Top livros mais emprestados
4. Taxa de rotatividade por livro
5. Exportação do relatório (CSV, PDF)
6. Alertas quando disponibilidade baixa
7. Projeção de demanda futura

---

**Implementado por:** Sistema de Qualidade de Software  
**Data:** 03/11/2025  
**Status:** ✅ Completo e Testado

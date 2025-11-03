# Changelog - Sistema de Biblioteca

## [Nova Feature] - Relatório de Disponibilidade (NF05)

### Data: 03/11/2025

### Descrição
Implementação de relatório de disponibilidade de livros que permite ao operador da biblioteca visualizar um resumo completo da situação dos exemplares cadastrados, incluindo total de livros, exemplares emprestados e disponíveis.

### Implementação Realizada

#### 1. Novo Método no LibraryService (`services/LibraryService.js`)

**Método adicionado:**
- `getAvailabilityReport()`: Gera relatório completo de disponibilidade

**Retorna objeto com:**
- `totalBooks`: Total de exemplares cadastrados no acervo
- `totalBorrowed`: Total de exemplares emprestados
- `totalAvailable`: Total de exemplares disponíveis
- `bookCount`: Número de títulos diferentes cadastrados

#### 2. Interface no Console (`app.js` e `ui/consoleUI.js`)

- Nova opção no menu: "9. Relatório de disponibilidade"
- Exibição formatada com:
  - Contadores totais
  - Percentuais de empréstimo e disponibilidade
  - Visualização gráfica com barras de progresso

### Exemplos de Uso

#### Via LibraryService
```javascript
const report = libraryService.getAvailabilityReport();

console.log(`Total de títulos: ${report.bookCount}`);
console.log(`Total de exemplares: ${report.totalBooks}`);
console.log(`Emprestados: ${report.totalBorrowed}`);
console.log(`Disponíveis: ${report.totalAvailable}`);
```

#### Via Interface de Console
1. Execute o aplicativo: `node app.js`
2. Escolha a opção "9. Relatório de disponibilidade"
3. Visualize o resumo completo

### Testes Implementados

**6 novos testes para Relatório de Disponibilidade:**

1. ✅ **Biblioteca vazia**: Verifica relatório quando não há livros cadastrados
2. ✅ **Todos disponíveis**: Testa cálculo com todos os exemplares disponíveis
3. ✅ **Todos emprestados**: Testa cálculo com todos os exemplares emprestados
4. ✅ **Empréstimos parciais**: Valida cálculo com situação mista
5. ✅ **Consistência de dados**: Verifica que total = emprestados + disponíveis
6. ✅ **Livro único**: Testa com apenas um título cadastrado

**Total: 27 testes passando** ✅

### Critérios de Aceitação Atendidos

✅ **Os valores são consistentes com os dados do repositório**
- Todos os cálculos baseados nos dados reais do repositório
- Validação de consistência: totalBooks = totalBorrowed + totalAvailable

✅ **Testes cobrem todos os cenários**
- Nenhum livro cadastrado
- Todos os exemplares disponíveis
- Todos os exemplares emprestados
- Situações mistas (empréstimos parciais)

✅ **Exibição resumida no console**
- Formato claro e objetivo
- Inclui percentuais
- Visualização gráfica opcional

### Exemplo de Saída do Relatório

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

### Arquivos Modificados

1. **`services/LibraryService.js`** - Método `getAvailabilityReport()`
2. **`app.js`** - Case 9 com exibição do relatório
3. **`ui/consoleUI.js`** - Opção 9 no menu
4. **`tests/libraryService.test.js`** - 6 novos testes

### Arquivos Criados

5. **`examples/availability-report-example.js`** - Exemplo detalhado de uso

---

## [Nova Feature] - Registro de Datas e Cálculo de Tempo de Empréstimo

### Implementação Realizada

#### 1. Modificações no Modelo User (`models/User.js`)

- **Estrutura de dados alterada**: `Set` → `Map`
  - Agora armazena objeto com `borrowDate` e `returnDate` para cada empréstimo
  
- **Novos métodos**:
  - `borrow(title, borrowDate)`: Registra empréstimo com data
  - `return(title, returnDate)`: Registra devolução com data e retorna informações do empréstimo
  - `getLoanInfo(title)`: Retorna informações completas de um empréstimo
  - `calculateLoanDuration(title)`: Calcula a duração do empréstimo em dias

- **Métodos atualizados**:
  - `hasBorrowed(title)`: Verifica se tem empréstimo ativo (sem data de devolução)
  - `loanCount()`: Conta apenas empréstimos ativos
  - `listLoans()`: Lista apenas empréstimos ativos

#### 2. Modificações no LibraryService (`services/LibraryService.js`)

- **Métodos atualizados**:
  - `borrowBook(userId, title, borrowDate = new Date())`: Aceita data de empréstimo opcional
  - `returnBook(userId, title, returnDate = new Date())`: Aceita data de devolução opcional e retorna objeto do empréstimo

- **Novo método**:
  - `getLoanDuration(userId, title)`: Obtém informações de duração do empréstimo

### Exemplos de Uso

```javascript
const service = new LibraryService(repository);

// 1. Emprestar livro (data atual)
service.borrowBook("user123", "Clean Code");

// 2. Emprestar livro com data específica
const borrowDate = new Date('2025-10-01');
service.borrowBook("user123", "Design Patterns", borrowDate);

// 3. Devolver livro (data atual)
const loanInfo = service.returnBook("user123", "Clean Code");
console.log(loanInfo.borrowDate);  // Data do empréstimo
console.log(loanInfo.returnDate);  // Data da devolução

// 4. Devolver livro com data específica
const returnDate = new Date('2025-10-15');
service.returnBook("user123", "Design Patterns", returnDate);

// 5. Calcular duração do empréstimo
const duration = service.getLoanDuration("user123", "Design Patterns");
console.log(duration.days);         // Número de dias
console.log(duration.borrowDate);   // Data de empréstimo
console.log(duration.returnDate);   // Data de devolução
console.log(duration.isActive);     // false (já foi devolvido)
```

### Testes Implementados

**Total: 21 testes passando** ✅

#### Novos Testes de Data e Tempo (6 testes):

1. ✅ **Registro de data de empréstimo**: Verifica que a data é armazenada corretamente
2. ✅ **Registro de data de devolução**: Verifica que a data de devolução é registrada
3. ✅ **Cálculo de tempo em dias**: Testa cálculo preciso entre duas datas
4. ✅ **Cálculo para empréstimo ativo**: Calcula tempo até a data atual para livros não devolvidos
5. ✅ **Erro para empréstimo inexistente**: Lança erro ao tentar calcular duração de empréstimo que não existe
6. ✅ **Múltiplos empréstimos**: Verifica cálculo correto para diferentes períodos

### Características

- **Retrocompatibilidade**: As datas são opcionais, usando `new Date()` como padrão
- **Empréstimos ativos vs histórico**: Diferencia entre livros atualmente emprestados e histórico completo
- **Cálculo automático**: Para empréstimos ativos, calcula tempo até a data atual
- **Precisão em dias**: Cálculo baseado em dias completos (24 horas)

### Regras de Negócio Mantidas

Todas as regras de negócio anteriores continuam funcionando:
- Limite de 3 empréstimos simultâneos por usuário
- Impossibilidade de emprestar o mesmo livro duas vezes
- Verificação de quantidade disponível
- Limite máximo de 5 exemplares por livro
- Validação de usuário e livro existentes

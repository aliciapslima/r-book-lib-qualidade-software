# Relatorio das evoluções - Sistema de Biblioteca

## Registrar data de empréstimo e devolução (NF02)

### Descrição
Guarda a data de cada empréstimo e calcula o tempo de devolução.

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

### Testes Implementados

**Total: 21 testes passando**

#### Novos Testes de Data e Tempo (6 testes):

1. **Registro de data de empréstimo**: Verifica que a data é armazenada corretamente
2. **Registro de data de devolução**: Verifica que a data de devolução é registrada
3. **Cálculo de tempo em dias**: Testa cálculo preciso entre duas datas
4. **Cálculo para empréstimo ativo**: Calcula tempo até a data atual para livros não devolvidos
5. **Erro para empréstimo inexistente**: Lança erro ao tentar calcular duração de empréstimo que não existe
6. **Múltiplos empréstimos**: Verifica cálculo correto para diferentes períodos

### Regras de Negócio Mantidas

Todas as regras de negócio anteriores continuam funcionando:
- Limite de 3 empréstimos simultâneos por usuário
- Impossibilidade de emprestar o mesmo livro duas vezes
- Verificação de quantidade disponível
- Limite máximo de 5 exemplares por livro
- Validação de usuário e livro existentes

---

## Relatório de Disponibilidade (NF05)

### Descrição
Exibe relatório resumido: total de livros, emprestados e disponíveis.

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

#### Via Interface de Console
1. Execute o aplicativo: `node app.js`
2. Escolha a opção "9. Relatório de disponibilidade"
3. Visualize o resumo completo

### Testes Implementados

**6 novos testes para Relatório de Disponibilidade:**

1. **Biblioteca vazia**: Verifica relatório quando não há livros cadastrados
2. **Todos disponíveis**: Testa cálculo com todos os exemplares disponíveis
3. **Todos emprestados**: Testa cálculo com todos os exemplares emprestados
4. **Empréstimos parciais**: Valida cálculo com situação mista
5. **Consistência de dados**: Verifica que total = emprestados + disponíveis
6. **Livro único**: Testa com apenas um título cadastrado

**Total: 27 testes passando**

### Critérios de Aceitação Atendidos

**Os valores são consistentes com os dados do repositório**
- Todos os cálculos baseados nos dados reais do repositório
- Validação de consistência: totalBooks = totalBorrowed + totalAvailable

**Testes cobrem todos os cenários**
- Nenhum livro cadastrado
- Todos os exemplares disponíveis
- Todos os exemplares emprestados
- Situações mistas (empréstimos parciais)

**Exibição resumida no console**
- Formato claro e objetivo
- Inclui percentuais
- Visualização gráfica opcional

### Arquivos Modificados

- **`services/LibraryService.js`** - Método `getAvailabilityReport()`
- **`app.js`** - Case 9 com exibição do relatório
- **`ui/consoleUI.js`** - Opção 9 no menu
- **`tests/libraryService.test.js`** - 6 novos testes

---

## Remover Usuário sem Empréstimos Ativos (NF08)

### Descrição
Adiciona função para remover usuários sem empréstimos ativos.

### Critérios de Aceitação Atendidos

- Validação de Existência: O usuário deve existir ("Usuário não encontrado").
- Empréstimos Ativos: A remoção é impedida se o usuário possuir livros emprestados (returnDate === null).
- Mensagem de Erro: Exibição clara de erro: "Usuário possui empréstimos ativos".
- Cobertura de Testes: Testes unitários cobrem cenários de remoção válida e inválida.

### Implementação Realizada

Lógica de Negócio (```services/LibraryService.js```): Foi adicionado o método ```removeUser(id)```. Ele valida a existência do usuário e verifica se há empréstimos ativos ```(loanCount() > 0)```. Se todas as condições permitirem, a remoção é delegada ao repositório.

Repositório (```repos/InMemoryRepository.js```): O método ```removeUser(id)``` foi implementado para executar a remoção do usuário na estrutura de dados.

Interface no Console (```app.js e ui/consoleUI.js```): Uma nova opção de menu ("6. Remover usuário") foi adicionada. O fluxo solicita o ID do usuário e exibe as mensagens de sucesso ou de erro apropriadas.

### Testes Implementados:

Total de Testes: 31 passando (4 novos testes para removeUser)

- Remover usuário inexistente
- Remover usuário com empréstimos
- Remover usuário sem empréstimos
- Remover após devolver tudo

### Arquivos Modificados

- ```services/LibraryService.js```
- ```repos/InMemoryRepository.js```
- ```ui/consoleUI.js```
- ```app.js```
- ```tests/libraryService.test.js (com 4 novos testes).```



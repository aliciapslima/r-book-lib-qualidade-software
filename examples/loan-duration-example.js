// examples/loan-duration-example.js
// Exemplo de uso do sistema de registro de datas e cálculo de tempo

const LibraryService = require('../services/LibraryService');
const InMemoryRepository = require('../repos/InMemoryRepository');

// Setup
const repo = new InMemoryRepository();
const library = new LibraryService(repo);

console.log('=== EXEMPLO: Sistema de Registro de Datas de Empréstimo ===\n');

// 1. Registrar livro e usuário
library.registerBook("Clean Code", "Robert C. Martin", 3);
library.registerUser("user001", "Maria Silva");

console.log('✓ Livro e usuário cadastrados\n');

// 2. Emprestar livro com data específica
const borrowDate = new Date('2025-10-01T10:00:00');
library.borrowBook("user001", "Clean Code", borrowDate);
console.log('✓ Livro emprestado em:', borrowDate.toLocaleDateString());

// 3. Verificar informações do empréstimo ativo
const user = repo.findUser("user001");
const activeLoanInfo = user.getLoanInfo("Clean Code");
console.log('  - Data de empréstimo:', activeLoanInfo.borrowDate.toLocaleDateString());
console.log('  - Status: Empréstimo ativo (não devolvido)\n');

// 4. Calcular tempo de empréstimo (ainda ativo)
let duration = library.getLoanDuration("user001", "Clean Code");
console.log('✓ Tempo de empréstimo (até hoje):');
console.log('  - Dias:', duration.days);
console.log('  - Status ativo:', duration.isActive);
console.log('  - Data de devolução:', duration.returnDate === null ? 'Ainda não devolvido' : duration.returnDate);
console.log();

// 5. Devolver livro com data específica
const returnDate = new Date('2025-10-15T10:00:00');
const loanReturn = library.returnBook("user001", "Clean Code", returnDate);
console.log('✓ Livro devolvido em:', returnDate.toLocaleDateString());
console.log('  - Data de empréstimo:', loanReturn.borrowDate.toLocaleDateString());
console.log('  - Data de devolução:', loanReturn.returnDate.toLocaleDateString());
console.log();

// 6. Calcular tempo total do empréstimo
duration = library.getLoanDuration("user001", "Clean Code");
console.log('✓ Tempo total do empréstimo:');
console.log('  - Dias:', duration.days, 'dias');
console.log('  - Período:', duration.borrowDate.toLocaleDateString(), 'até', duration.returnDate.toLocaleDateString());
console.log('  - Status ativo:', duration.isActive);
console.log();

// 7. Demonstrar múltiplos empréstimos
library.registerBook("Design Patterns", "Gang of Four", 2);
library.registerBook("Refactoring", "Martin Fowler", 2);

const borrow2 = new Date('2025-10-05T10:00:00');
const borrow3 = new Date('2025-10-20T10:00:00');

library.borrowBook("user001", "Design Patterns", borrow2);
library.borrowBook("user001", "Refactoring", borrow3);

console.log('✓ Múltiplos empréstimos realizados:');
console.log('  - Design Patterns:', borrow2.toLocaleDateString());
console.log('  - Refactoring:', borrow3.toLocaleDateString());
console.log();

// 8. Verificar empréstimos ativos
const activeLoans = user.listLoans();
console.log('✓ Empréstimos ativos do usuário:', activeLoans.length);
activeLoans.forEach(title => {
    const info = user.getLoanInfo(title);
    console.log(`  - "${title}": emprestado há`, 
        Math.floor((new Date() - info.borrowDate) / (1000 * 60 * 60 * 24)), 
        'dias');
});
console.log();

// 9. Devolver um dos livros
const return2 = new Date('2025-10-18T10:00:00');
library.returnBook("user001", "Design Patterns", return2);

const finalDuration = library.getLoanDuration("user001", "Design Patterns");
console.log('✓ "Design Patterns" devolvido:');
console.log('  - Tempo de empréstimo:', finalDuration.days, 'dias');
console.log('  - Empréstimos ativos restantes:', user.loanCount());

console.log('\n=== FIM DO EXEMPLO ===');

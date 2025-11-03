// examples/availability-report-example.js
// Exemplo de uso do relatório de disponibilidade de livros

const LibraryService = require('../services/LibraryService');
const InMemoryRepository = require('../repos/InMemoryRepository');

// Setup
const repo = new InMemoryRepository();
const library = new LibraryService(repo);

console.log('=== EXEMPLO: Relatório de Disponibilidade de Livros (NF05) ===\n');

// Cenário 1: Biblioteca vazia
console.log('📊 CENÁRIO 1: Biblioteca sem livros cadastrados');
console.log('─'.repeat(60));
let report = library.getAvailabilityReport();
displayReport(report);
console.log();

// Cenário 2: Todos os livros disponíveis
console.log('📊 CENÁRIO 2: Todos os exemplares disponíveis');
console.log('─'.repeat(60));
library.registerBook("Clean Code", "Robert C. Martin", 3);
library.registerBook("Design Patterns", "Gang of Four", 2);
library.registerBook("Refactoring", "Martin Fowler", 4);
report = library.getAvailabilityReport();
displayReport(report);
console.log();

// Cenário 3: Alguns livros emprestados
console.log('📊 CENÁRIO 3: Empréstimos parciais');
console.log('─'.repeat(60));
library.registerUser("user001", "Maria Silva");
library.registerUser("user002", "João Santos");

library.borrowBook("user001", "Clean Code");
library.borrowBook("user001", "Design Patterns");
library.borrowBook("user002", "Refactoring");
library.borrowBook("user002", "Clean Code");

report = library.getAvailabilityReport();
displayReport(report);
console.log();

// Cenário 4: Todos os exemplares emprestados
console.log('📊 CENÁRIO 4: Simulação com todos os exemplares emprestados');
console.log('─'.repeat(60));
// Emprestar mais exemplares
library.borrowBook("user001", "Refactoring");
library.registerUser("user003", "Ana Costa");
library.borrowBook("user003", "Clean Code"); // último Clean Code
library.borrowBook("user003", "Refactoring"); // outro Refactoring

report = library.getAvailabilityReport();
displayReport(report);
console.log();

// Cenário 5: Após devoluções
console.log('📊 CENÁRIO 5: Após algumas devoluções');
console.log('─'.repeat(60));
library.returnBook("user001", "Clean Code");
library.returnBook("user002", "Refactoring");

report = library.getAvailabilityReport();
displayReport(report);
console.log();

// Cenário 6: Adicionando mais livros
console.log('📊 CENÁRIO 6: Expandindo o acervo');
console.log('─'.repeat(60));
library.registerBook("The Pragmatic Programmer", "Hunt & Thomas", 5);
library.registerBook("Domain-Driven Design", "Eric Evans", 3);

report = library.getAvailabilityReport();
displayReport(report);
console.log();

console.log('=== FIM DO EXEMPLO ===\n');

// Função auxiliar para exibir o relatório
function displayReport(report) {
    console.log(`📚 Total de títulos cadastrados: ${report.bookCount}`);
    console.log(`📖 Total de exemplares no acervo: ${report.totalBooks}`);
    console.log(`📤 Exemplares emprestados: ${report.totalBorrowed} (${calculatePercentage(report.totalBorrowed, report.totalBooks)}%)`);
    console.log(`📥 Exemplares disponíveis: ${report.totalAvailable} (${calculatePercentage(report.totalAvailable, report.totalBooks)}%)`);
    
    if (report.totalBooks > 0) {
        console.log('\n📊 Visualização:');
        displayBar('Emprestados', report.totalBorrowed, report.totalBooks, '🟥');
        displayBar('Disponíveis', report.totalAvailable, report.totalBooks, '🟩');
    }
}

function calculatePercentage(value, total) {
    if (total === 0) return 0;
    return ((value / total) * 100).toFixed(1);
}

function displayBar(label, value, total, symbol) {
    const maxBars = 20;
    const bars = total === 0 ? 0 : Math.round((value / total) * maxBars);
    const barStr = symbol.repeat(bars) + '⬜'.repeat(maxBars - bars);
    console.log(`  ${label.padEnd(15)} ${barStr} ${value}/${total}`);
}

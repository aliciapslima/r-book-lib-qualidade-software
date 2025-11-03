// examples/remove-user-example.js
// Exemplo de uso da funcionalidade de remoção de usuários (NF08)

const LibraryService = require('../services/LibraryService');
const InMemoryRepository = require('../repos/InMemoryRepository');

// Setup
const repo = new InMemoryRepository();
const library = new LibraryService(repo);

console.log('=== EXEMPLO: Remoção de Usuários (NF08) ===\n');

// Setup inicial
library.registerBook("Clean Code", "Robert C. Martin", 3);
library.registerBook("Design Patterns", "Gang of Four", 2);

library.registerUser("user001", "Maria Silva");
library.registerUser("user002", "João Santos");
library.registerUser("user003", "Ana Costa");

console.log('✓ Biblioteca configurada com 2 livros e 3 usuários\n');

// Cenário 1: Remover usuário sem empréstimos
console.log('📋 CENÁRIO 1: Remover usuário sem empréstimos');
console.log('─'.repeat(60));
try {
    library.removeUser("user003");
    console.log('✅ Usuário "user003" (Ana Costa) removido com sucesso!');
    console.log(`   Total de usuários restantes: ${library.listUsers().length}`);
} catch (error) {
    console.log('❌ Erro:', error.message);
}
console.log();

// Cenário 2: Tentar remover usuário inexistente
console.log('📋 CENÁRIO 2: Tentar remover usuário inexistente');
console.log('─'.repeat(60));
try {
    library.removeUser("user999");
    console.log('✅ Usuário removido');
} catch (error) {
    console.log('❌ Erro esperado:', error.message);
}
console.log();

// Cenário 3: Tentar remover usuário com empréstimos ativos
console.log('📋 CENÁRIO 3: Tentar remover usuário com empréstimos ativos');
console.log('─'.repeat(60));

// Fazer empréstimos
library.borrowBook("user001", "Clean Code");
library.borrowBook("user001", "Design Patterns");
console.log('   Usuário "user001" tem 2 empréstimos ativos');

try {
    library.removeUser("user001");
    console.log('✅ Usuário removido');
} catch (error) {
    console.log('❌ Erro esperado:', error.message);
    const loans = library.listLoans("user001");
    console.log(`   Empréstimos ativos: ${loans.join(", ")}`);
}
console.log();

// Cenário 4: Remover usuário após devolver todos os livros
console.log('📋 CENÁRIO 4: Remover usuário após devolver todos os livros');
console.log('─'.repeat(60));

// Fazer empréstimo
library.borrowBook("user002", "Clean Code");
console.log('   Usuário "user002" pegou "Clean Code" emprestado');

// Devolver
library.returnBook("user002", "Clean Code");
console.log('   Usuário "user002" devolveu "Clean Code"');

try {
    library.removeUser("user002");
    console.log('✅ Usuário "user002" (João Santos) removido com sucesso!');
    console.log('   (Usuário não tinha mais empréstimos ativos)');
    console.log(`   Total de usuários restantes: ${library.listUsers().length}`);
} catch (error) {
    console.log('❌ Erro:', error.message);
}
console.log();

// Cenário 5: Estado final
console.log('📊 ESTADO FINAL DA BIBLIOTECA');
console.log('─'.repeat(60));
const users = library.listUsers();
console.log(`Total de usuários: ${users.length}`);
users.forEach(user => {
    const loans = library.listLoans(user.id);
    console.log(`  - ${user.id} (${user.name}): ${loans.length} empréstimo(s) ativo(s)`);
    if (loans.length > 0) {
        console.log(`    Livros: ${loans.join(", ")}`);
    }
});

console.log('\n=== FIM DO EXEMPLO ===');

// tests/libraryService.test.js

const LibraryService = require('../services/LibraryService');

const Book = require('../models/Book');
const User = require('../models/User');

// Variáveis que serão redefinidas antes de cada teste
let mockRepository;
let libraryService;

// Mocks e Setup
beforeEach(() => {

    // 1. Cria um objeto mock simulando o repositório
    mockRepository = {
        // Mocka os métodos chamados pelo LibraryService
        findBook: jest.fn(),
        addBook: jest.fn(),
        removeBook: jest.fn(),
        listBooks: jest.fn(),
        findUser: jest.fn(),
        addUser: jest.fn(),
        removeUser: jest.fn(),
    };

    // 2. Cria a instância do LibraryService com o repositório mockado
    libraryService = new LibraryService(mockRepository);
});

// Testes
describe('LibraryService - Livros', () => {
    
    it('deve lançar um erro ao registrar um livro com um titulo duplicado (RN01)', () => {

        // ARRANGE
        const title = "O Pequeno Príncipe";
        const author = "Antoine de Saint-Exupéry";
        const quantity = 5;

        // simula que o livro já existe no repositório e dispara o erro esperado
        mockRepository.findBook.mockReturnValue(new Book(title, author, 2));

        // ACT & ASSERT
        expect(() => {
            libraryService.registerBook(title, author, quantity);
        }).toThrow("Livro já existe na biblioteca");
        
        // addBook NÃO deve ser chamado, pois falhou na validação
        expect(mockRepository.addBook).not.toHaveBeenCalled();
    });

    it('deve lançar um erro ao registrar um livro com quantidade inválida (<=0)', () => {

        // ARRANGE
        const title = "Hamlet";
        const author = "William Shakespeare";
        const quantity = 0; // quantidade inválida

        // simula que o livro NÃO existe no repositório
        mockRepository.findBook.mockReturnValue(undefined);

        // ACT & ASSERT
        expect(() => {
            libraryService.registerBook(title, author, quantity);
        }).toThrow("Quantidade deve ser positiva");

        // addBook NÃO deve ser chamado quando a validação falha
        expect(mockRepository.addBook).not.toHaveBeenCalled();
    });

    it('deve lançar um erro ao tentar remover um livro com exemplares emprestados', () => {

        // ARRANGE
        const bookTitle = "O Senhor dos Anéis";

        // simula livro com quantidade original 5, mas apenas 3 disponíveis (2 emprestados)
        const mockBook = new Book(bookTitle, "J.R.R. Tolkien", 5);
        mockBook.quantity = 3; // 2 exemplares foram emprestados
        mockRepository.findBook.mockReturnValue(mockBook);

        // ACT & ASSERT
        expect(() => {
            libraryService.removeBook(bookTitle);
        }).toThrow("Não é possível remover: há exemplares emprestados");

        // removeBook NÃO deve ser chamado quando há exemplares emprestados
        expect(mockRepository.removeBook).not.toHaveBeenCalled();
    });

    it('deve remover livro com sucesso quando todas as cópias estão disponíveis', () => {

        // ARRANGE
        const bookTitle = "Clean Architecture";

        // simula livro com todas as cópias disponíveis (quantity === originalQuantity)
        const mockBook = new Book(bookTitle, "Robert C. Martin", 4);
        // mockBook.quantity = 4 e mockBook.originalQuantity = 4 (todas as cópias disponíveis)
        mockRepository.findBook.mockReturnValue(mockBook);

        // ACT
        const result = libraryService.removeBook(bookTitle);

        // ASSERT
        expect(result).toBe(true);
        expect(mockRepository.removeBook).toHaveBeenCalledWith(bookTitle);
        expect(mockRepository.removeBook).toHaveBeenCalledTimes(1);
    });
});

describe('LibraryService - Usuários', () => {
    
    it('deve lançar um erro ao cadastrar um usuário com identificador duplicado', () => {

        // ARRANGE
        const userId = "123";
        const userName = "João Silva";

        // simula que o usuário já existe no repositório
        mockRepository.findUser.mockReturnValue(new User(userId, userName));

        // ACT & ASSERT
        expect(() => {
            libraryService.registerUser(userId, userName);
        }).toThrow("Usuário já cadastrado");
        
        // addUser NÃO deve ser chamado, pois falhou na validação
        expect(mockRepository.addUser).not.toHaveBeenCalled();
    });

    it('deve lançar um erro ao tentar remover um usuário inexistente', () => {

        // ARRANGE
        const userId = "999";

        // simula que o usuário NÃO existe
        mockRepository.findUser.mockReturnValue(null);

        // ACT & ASSERT
        expect(() => {
            libraryService.removeUser(userId);
        }).toThrow("Usuário não encontrado");
        
        // removeUser NÃO deve ser chamado
        expect(mockRepository.removeUser).not.toHaveBeenCalled();
    });

    it('deve lançar um erro ao tentar remover usuário com empréstimos ativos', () => {

        // ARRANGE
        const userId = "123";
        
        // simula usuário com 2 empréstimos ativos
        const mockUser = new User(userId, "João Silva");
        mockUser.borrow("Clean Code");
        mockUser.borrow("Design Patterns");
        mockRepository.findUser.mockReturnValue(mockUser);

        // ACT & ASSERT
        expect(() => {
            libraryService.removeUser(userId);
        }).toThrow("Usuário possui empréstimos ativos");
        
        // removeUser NÃO deve ser chamado quando há empréstimos ativos
        expect(mockRepository.removeUser).not.toHaveBeenCalled();
    });

    it('deve remover usuário com sucesso quando não há empréstimos ativos', () => {

        // ARRANGE
        const userId = "123";
        
        // simula usuário sem empréstimos ativos
        const mockUser = new User(userId, "João Silva");
        mockRepository.findUser.mockReturnValue(mockUser);
        mockRepository.removeUser = jest.fn().mockReturnValue(true);

        // ACT
        const result = libraryService.removeUser(userId);

        // ASSERT
        expect(result).toBe(true);
        expect(mockRepository.removeUser).toHaveBeenCalledWith(userId);
        expect(mockRepository.removeUser).toHaveBeenCalledTimes(1);
    });

    it('deve remover usuário que já devolveu todos os livros', () => {

        // ARRANGE
        const userId = "456";
        
        // simula usuário que tinha empréstimos mas devolveu tudo
        const mockUser = new User(userId, "Maria Santos");
        mockUser.borrow("Refactoring");
        mockUser.return("Refactoring"); // devolveu
        mockRepository.findUser.mockReturnValue(mockUser);
        mockRepository.removeUser = jest.fn().mockReturnValue(true);

        // ACT
        const result = libraryService.removeUser(userId);

        // ASSERT
        expect(result).toBe(true);
        expect(mockUser.loanCount()).toBe(0); // confirma que não há empréstimos ativos
        expect(mockRepository.removeUser).toHaveBeenCalledWith(userId);
    });
});

describe('LibraryService - Empréstimos', () => {
    
    it('deve lançar um erro ao tentar emprestar um livro inexistente', () => {

        // ARRANGE
        const userId = "123";
        const bookTitle = "Livro Inexistente";

        // simula que o usuário existe
        const mockUser = new User(userId, "João Silva");
        mockRepository.findUser.mockReturnValue(mockUser);

        // simula que o livro NÃO existe no repositório
        mockRepository.findBook.mockReturnValue(null);

        // ACT & ASSERT
        expect(() => {
            libraryService.borrowBook(userId, bookTitle);
        }).toThrow("Livro não encontrado");
    });

    it('deve lançar um erro ao tentar emprestar um livro com quantidade 0', () => {

        // ARRANGE
        const userId = "123";
        const bookTitle = "Harry Potter";

        // simula que o usuário existe
        const mockUser = new User(userId, "João Silva");
        mockRepository.findUser.mockReturnValue(mockUser);

        // simula que o livro existe mas com quantidade 0 (todos os exemplares emprestados)
        const mockBook = new Book(bookTitle, "J.K. Rowling", 1);
        mockBook.quantity = 0; // simula que todos os exemplares foram emprestados
        mockRepository.findBook.mockReturnValue(mockBook);

        // ACT & ASSERT
        expect(() => {
            libraryService.borrowBook(userId, bookTitle);
        }).toThrow("Nenhum exemplar disponível");
    });

    it('deve lançar um erro ao tentar emprestar para um usuário inexistente', () => {

        // ARRANGE
        const userId = "999";
        const bookTitle = "Harry Potter";

        // simula que o usuário NÃO existe
        mockRepository.findUser.mockReturnValue(null);

        // ACT & ASSERT
        expect(() => {
            libraryService.borrowBook(userId, bookTitle);
        }).toThrow("Usuário não encontrado");
    });

    it('deve lançar um erro quando usuário já tem 3 livros emprestados', () => {

        // ARRANGE
        const userId = "123";
        const bookTitle = "O Senhor dos Anéis";

        // simula usuário com 3 livros já emprestados
        const mockUser = new User(userId, "João Silva");
        mockUser.borrow("Livro 1");
        mockUser.borrow("Livro 2");
        mockUser.borrow("Livro 3");
        mockRepository.findUser.mockReturnValue(mockUser);

        // simula que o livro existe e está disponível
        const mockBook = new Book(bookTitle, "J.R.R. Tolkien", 5);
        mockRepository.findBook.mockReturnValue(mockBook);

        // ACT & ASSERT
        expect(() => {
            libraryService.borrowBook(userId, bookTitle);
        }).toThrow("Usuário atingiu o limite de empréstimos (3)");
    });

    it('deve lançar um erro quando usuário já tem o mesmo livro emprestado', () => {

        // ARRANGE
        const userId = "123";
        const bookTitle = "1984";

        // simula usuário que já tem o livro emprestado
        const mockUser = new User(userId, "João Silva");
        mockUser.borrow(bookTitle);
        mockRepository.findUser.mockReturnValue(mockUser);

        // simula que o livro existe e está disponível
        const mockBook = new Book(bookTitle, "George Orwell", 3);
        mockRepository.findBook.mockReturnValue(mockBook);

        // ACT & ASSERT
        expect(() => {
            libraryService.borrowBook(userId, bookTitle);
        }).toThrow("Usuário já tem esse livro emprestado");
    });

    it('deve realizar empréstimo com sucesso: desconta quantidade e registra no usuário', () => {

        // ARRANGE
        const userId = "123";
        const bookTitle = "Clean Code";

        // simula usuário sem empréstimos
        const mockUser = new User(userId, "João Silva");
        mockRepository.findUser.mockReturnValue(mockUser);

        // simula livro disponível com quantidade 3
        const mockBook = new Book(bookTitle, "Robert C. Martin", 3);
        mockRepository.findBook.mockReturnValue(mockBook);

        // ACT
        const result = libraryService.borrowBook(userId, bookTitle);

        // ASSERT
        expect(result).toBe(true);
        expect(mockBook.quantity).toBe(2); // quantidade foi decrementada
        expect(mockUser.hasBorrowed(bookTitle)).toBe(true); // livro foi registrado no usuário
        expect(mockUser.loanCount()).toBe(1); // usuário tem 1 empréstimo
    });
});

describe('LibraryService - Devoluções', () => {
    
    it('deve lançar um erro ao tentar devolver um livro que o usuário não emprestou', () => {

        // ARRANGE
        const userId = "123";
        const bookTitle = "O Hobbit";

        // simula usuário que NÃO tem o livro emprestado
        const mockUser = new User(userId, "João Silva");
        mockRepository.findUser.mockReturnValue(mockUser);

        // simula que o livro existe
        const mockBook = new Book(bookTitle, "J.R.R. Tolkien", 3);
        mockRepository.findBook.mockReturnValue(mockBook);

        // ACT & ASSERT
        expect(() => {
            libraryService.returnBook(userId, bookTitle);
        }).toThrow("Usuário não emprestou este livro");
    });

    it('deve lançar um erro ao tentar devolver um livro inexistente', () => {

        // ARRANGE
        const userId = "123";
        const bookTitle = "Livro Inexistente";

        // simula usuário que existe
        const mockUser = new User(userId, "João Silva");
        mockRepository.findUser.mockReturnValue(mockUser);

        // simula que o livro NÃO existe
        mockRepository.findBook.mockReturnValue(null);

        // ACT & ASSERT
        expect(() => {
            libraryService.returnBook(userId, bookTitle);
        }).toThrow("Livro não encontrado");
    });

    it('deve lançar um erro quando devolução excederia a quantidade máxima (5)', () => {

        // ARRANGE
        const userId = "123";
        const bookTitle = "Código Limpo";

        // simula usuário que tem o livro emprestado
        const mockUser = new User(userId, "João Silva");
        mockUser.borrow(bookTitle);
        mockRepository.findUser.mockReturnValue(mockUser);

        // simula livro com quantidade já no máximo (5)
        const mockBook = new Book(bookTitle, "Robert C. Martin", 5);
        mockRepository.findBook.mockReturnValue(mockBook);

        // ACT & ASSERT
        expect(() => {
            libraryService.returnBook(userId, bookTitle);
        }).toThrow("Quantidade máxima atingida");
    });

    it('deve realizar devolução com sucesso: incrementa quantidade e remove registro de empréstimo', () => {

        // ARRANGE
        const userId = "123";
        const bookTitle = "Domain-Driven Design";

        // simula usuário que tem o livro emprestado
        const mockUser = new User(userId, "João Silva");
        mockUser.borrow(bookTitle);
        mockRepository.findUser.mockReturnValue(mockUser);

        // simula livro com quantidade 2 (pode receber devolução)
        const mockBook = new Book(bookTitle, "Eric Evans", 2);
        mockRepository.findBook.mockReturnValue(mockBook);

        // ACT
        const result = libraryService.returnBook(userId, bookTitle);

        // ASSERT
        expect(result).toBeDefined(); // retorna objeto de empréstimo
        expect(result.borrowDate).toBeDefined(); // tem data de empréstimo
        expect(result.returnDate).toBeDefined(); // tem data de devolução
        expect(mockBook.quantity).toBe(3); // quantidade foi incrementada
        expect(mockUser.hasBorrowed(bookTitle)).toBe(false); // livro foi removido do registro do usuário
        expect(mockUser.loanCount()).toBe(0); // usuário não tem mais empréstimos
    });
});

describe('LibraryService - Registro de Datas e Cálculo de Tempo', () => {
    
    it('deve registrar a data de empréstimo ao emprestar um livro', () => {

        // ARRANGE
        const userId = "123";
        const bookTitle = "Test Driven Development";
        const borrowDate = new Date('2025-10-01T10:00:00');

        const mockUser = new User(userId, "João Silva");
        mockRepository.findUser.mockReturnValue(mockUser);

        const mockBook = new Book(bookTitle, "Kent Beck", 3);
        mockRepository.findBook.mockReturnValue(mockBook);

        // ACT
        libraryService.borrowBook(userId, bookTitle, borrowDate);

        // ASSERT
        const loanInfo = mockUser.getLoanInfo(bookTitle);
        expect(loanInfo).toBeDefined();
        expect(loanInfo.borrowDate).toEqual(borrowDate);
        expect(loanInfo.returnDate).toBeNull();
    });

    it('deve registrar a data de devolução ao devolver um livro', () => {

        // ARRANGE
        const userId = "123";
        const bookTitle = "Refactoring";
        const borrowDate = new Date('2025-10-01T10:00:00');
        const returnDate = new Date('2025-10-15T10:00:00');

        const mockUser = new User(userId, "João Silva");
        mockUser.borrow(bookTitle, borrowDate);
        mockRepository.findUser.mockReturnValue(mockUser);

        const mockBook = new Book(bookTitle, "Martin Fowler", 2);
        mockRepository.findBook.mockReturnValue(mockBook);

        // ACT
        const result = libraryService.returnBook(userId, bookTitle, returnDate);

        // ASSERT
        expect(result.borrowDate).toEqual(borrowDate);
        expect(result.returnDate).toEqual(returnDate);
    });

    it('deve calcular corretamente o tempo de empréstimo em dias', () => {

        // ARRANGE
        const userId = "123";
        const bookTitle = "Design Patterns";
        const borrowDate = new Date('2025-10-01T10:00:00');
        const returnDate = new Date('2025-10-15T10:00:00');

        const mockUser = new User(userId, "João Silva");
        mockUser.borrow(bookTitle, borrowDate);
        mockUser.return(bookTitle, returnDate);
        mockRepository.findUser.mockReturnValue(mockUser);

        // ACT
        const duration = libraryService.getLoanDuration(userId, bookTitle);

        // ASSERT
        expect(duration.days).toBe(14); // 14 dias entre 01/10 e 15/10
        expect(duration.borrowDate).toEqual(borrowDate);
        expect(duration.returnDate).toEqual(returnDate);
        expect(duration.isActive).toBe(false);
    });

    it('deve calcular o tempo de empréstimo para empréstimo ativo (não devolvido)', () => {

        // ARRANGE
        const userId = "123";
        const bookTitle = "Clean Code";
        const borrowDate = new Date('2025-10-01T10:00:00');

        const mockUser = new User(userId, "João Silva");
        mockUser.borrow(bookTitle, borrowDate);
        mockRepository.findUser.mockReturnValue(mockUser);

        // ACT
        const duration = libraryService.getLoanDuration(userId, bookTitle);

        // ASSERT
        expect(duration.days).toBeGreaterThanOrEqual(0); // pelo menos 0 dias
        expect(duration.borrowDate).toEqual(borrowDate);
        expect(duration.returnDate).toBeNull();
        expect(duration.isActive).toBe(true);
    });

    it('deve lançar erro ao tentar calcular duração de empréstimo inexistente', () => {

        // ARRANGE
        const userId = "123";
        const bookTitle = "Livro Não Emprestado";

        const mockUser = new User(userId, "João Silva");
        mockRepository.findUser.mockReturnValue(mockUser);

        // ACT & ASSERT
        expect(() => {
            libraryService.getLoanDuration(userId, bookTitle);
        }).toThrow("Empréstimo não encontrado");
    });

    it('deve calcular tempo diferente para múltiplos empréstimos', () => {

        // ARRANGE
        const userId = "123";
        const book1 = "Livro A";
        const book2 = "Livro B";
        const borrowDate1 = new Date('2025-10-01T10:00:00');
        const borrowDate2 = new Date('2025-10-10T10:00:00');
        const returnDate1 = new Date('2025-10-08T10:00:00');
        const returnDate2 = new Date('2025-10-25T10:00:00');

        const mockUser = new User(userId, "João Silva");
        mockUser.borrow(book1, borrowDate1);
        mockUser.borrow(book2, borrowDate2);
        mockUser.return(book1, returnDate1);
        mockUser.return(book2, returnDate2);
        mockRepository.findUser.mockReturnValue(mockUser);

        // ACT
        const duration1 = libraryService.getLoanDuration(userId, book1);
        const duration2 = libraryService.getLoanDuration(userId, book2);

        // ASSERT
        expect(duration1.days).toBe(7); // 7 dias
        expect(duration2.days).toBe(15); // 15 dias
        expect(duration1.days).not.toBe(duration2.days);
    });
});

describe('LibraryService - Relatório de Disponibilidade (NF05)', () => {
    
    it('deve retornar relatório vazio quando não há livros cadastrados', () => {

        // ARRANGE
        mockRepository.listBooks = jest.fn().mockReturnValue([]);

        // ACT
        const report = libraryService.getAvailabilityReport();

        // ASSERT
        expect(report.totalBooks).toBe(0);
        expect(report.totalBorrowed).toBe(0);
        expect(report.totalAvailable).toBe(0);
        expect(report.bookCount).toBe(0);
    });

    it('deve calcular corretamente quando todos os exemplares estão disponíveis', () => {

        // ARRANGE
        const book1 = new Book("Clean Code", "Robert C. Martin", 3);
        const book2 = new Book("Design Patterns", "Gang of Four", 2);
        const book3 = new Book("Refactoring", "Martin Fowler", 4);
        
        mockRepository.listBooks = jest.fn().mockReturnValue([book1, book2, book3]);

        // ACT
        const report = libraryService.getAvailabilityReport();

        // ASSERT
        expect(report.totalBooks).toBe(9); // 3 + 2 + 4
        expect(report.totalBorrowed).toBe(0); // nenhum emprestado
        expect(report.totalAvailable).toBe(9); // todos disponíveis
        expect(report.bookCount).toBe(3); // 3 títulos
    });

    it('deve calcular corretamente quando todos os exemplares estão emprestados', () => {

        // ARRANGE
        const book1 = new Book("Clean Code", "Robert C. Martin", 3);
        book1.quantity = 0; // todos emprestados

        const book2 = new Book("Design Patterns", "Gang of Four", 2);
        book2.quantity = 0; // todos emprestados
        
        mockRepository.listBooks = jest.fn().mockReturnValue([book1, book2]);

        // ACT
        const report = libraryService.getAvailabilityReport();

        // ASSERT
        expect(report.totalBooks).toBe(5); // 3 + 2
        expect(report.totalBorrowed).toBe(5); // todos emprestados
        expect(report.totalAvailable).toBe(0); // nenhum disponível
        expect(report.bookCount).toBe(2); // 2 títulos
    });

    it('deve calcular corretamente com empréstimos parciais', () => {

        // ARRANGE
        const book1 = new Book("Clean Code", "Robert C. Martin", 5);
        book1.quantity = 2; // 3 emprestados, 2 disponíveis

        const book2 = new Book("Design Patterns", "Gang of Four", 4);
        book2.quantity = 4; // todos disponíveis

        const book3 = new Book("Refactoring", "Martin Fowler", 3);
        book3.quantity = 1; // 2 emprestados, 1 disponível
        
        mockRepository.listBooks = jest.fn().mockReturnValue([book1, book2, book3]);

        // ACT
        const report = libraryService.getAvailabilityReport();

        // ASSERT
        expect(report.totalBooks).toBe(12); // 5 + 4 + 3
        expect(report.totalBorrowed).toBe(5); // 3 + 0 + 2
        expect(report.totalAvailable).toBe(7); // 2 + 4 + 1
        expect(report.bookCount).toBe(3); // 3 títulos
        
        // Validar consistência: total = emprestados + disponíveis
        expect(report.totalBooks).toBe(report.totalBorrowed + report.totalAvailable);
    });

    it('deve retornar valores consistentes: total = emprestados + disponíveis', () => {

        // ARRANGE
        const book1 = new Book("Livro A", "Autor A", 3);
        book1.quantity = 1;

        const book2 = new Book("Livro B", "Autor B", 5);
        book2.quantity = 3;

        const book3 = new Book("Livro C", "Autor C", 2);
        book3.quantity = 0;
        
        mockRepository.listBooks = jest.fn().mockReturnValue([book1, book2, book3]);

        // ACT
        const report = libraryService.getAvailabilityReport();

        // ASSERT - Consistência dos dados
        expect(report.totalBooks).toBe(report.totalBorrowed + report.totalAvailable);
        expect(report.totalBooks).toBe(10); // 3 + 5 + 2
        expect(report.totalBorrowed).toBe(6); // 2 + 2 + 2
        expect(report.totalAvailable).toBe(4); // 1 + 3 + 0
    });

    it('deve funcionar com um único livro com múltiplos exemplares', () => {

        // ARRANGE
        const book = new Book("The Pragmatic Programmer", "Hunt & Thomas", 5);
        book.quantity = 3; // 2 emprestados, 3 disponíveis
        
        mockRepository.listBooks = jest.fn().mockReturnValue([book]);

        // ACT
        const report = libraryService.getAvailabilityReport();

        // ASSERT
        expect(report.totalBooks).toBe(5);
        expect(report.totalBorrowed).toBe(2);
        expect(report.totalAvailable).toBe(3);
        expect(report.bookCount).toBe(1);
    });
});

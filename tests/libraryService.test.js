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
        findUser: jest.fn(),
        addUser: jest.fn(),
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
        expect(result).toBe(true);
        expect(mockBook.quantity).toBe(3); // quantidade foi incrementada
        expect(mockUser.hasBorrowed(bookTitle)).toBe(false); // livro foi removido do registro do usuário
        expect(mockUser.loanCount()).toBe(0); // usuário não tem mais empréstimos
    });
});

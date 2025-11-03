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

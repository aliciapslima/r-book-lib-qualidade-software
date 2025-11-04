const LibraryService = require('../services/LibraryService');
const InMemoryRepository = require('../repos/InMemoryRepository');

describe('LibraryService - extra coverage for error branches', () => {
  let repo;
  let library;

  beforeEach(() => {
    repo = new InMemoryRepository();
    library = new LibraryService(repo);
  });

  it('getLoanDuration deve lançar erro quando usuário não existe', () => {
    expect(() => library.getLoanDuration('no-user', 'Any')).toThrow('Usuário não encontrado');
  });

  it('listLoans deve lançar erro quando usuário não existe', () => {
    expect(() => library.listLoans('no-user')).toThrow('Usuário não encontrado');
  });

  it('registerBook deve propagar erro de título inválido (Book constructor)', () => {
    // título inválido (vazio) -> Book constructor lança 'Título inválido'
    expect(() => library.registerBook('', 'Autor', 1)).toThrow('Título inválido');
  });

  it('removeBook deve lançar erro quando o livro não existe', () => {
    expect(() => library.removeBook('Livro Inexistente')).toThrow('Livro não encontrado');
  });
});

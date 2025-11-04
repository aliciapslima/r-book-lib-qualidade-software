const Book = require('../models/Book');

describe('Book model - validações', () => {
  it('deve lançar erro quando o título for inválido', () => {
    expect(() => new Book('', 'Autor', 1)).toThrow('Título inválido');
  });

  it('deve lançar erro quando a quantidade for inválida (<=0)', () => {
    expect(() => new Book('Título Válido', 'Autor', 0)).toThrow('Quantidade deve ser positiva');
  });
});

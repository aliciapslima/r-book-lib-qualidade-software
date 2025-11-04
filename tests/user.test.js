const User = require('../models/User');

describe('User model - datas e listagem', () => {
  it('deve lançar erro ao devolver com data anterior ao empréstimo', () => {
    const user = new User('u1', 'Teste');
    const borrowDate = new Date('2025-10-10T10:00:00');
    user.borrow('Livro A', borrowDate);

    const badReturn = new Date('2025-10-01T10:00:00');
    expect(() => user.return('Livro A', badReturn)).toThrow('Data de devolução anterior à data de empréstimo');
  });

  it('listLoans(details = true) deve retornar objetos com borrowDate e returnDate', () => {
    const user = new User('u2', 'Maria');
    const b1 = new Date('2025-10-01T10:00:00');
    const r1 = new Date('2025-10-05T10:00:00');

    user.borrow('Livro B', b1);
    user.return('Livro B', r1);

    const loans = user.listLoans(true);
    expect(Array.isArray(loans)).toBe(true);
    expect(loans.length).toBe(1);

    const item = loans[0];
    expect(item).toHaveProperty('title', 'Livro B');
    expect(item).toHaveProperty('borrowDate');
    expect(item.borrowDate instanceof Date).toBe(true);
    expect(item).toHaveProperty('returnDate');
    expect(item.returnDate instanceof Date).toBe(true);
    expect(item).toHaveProperty('isActive', false);
  });

  it('getLoanInfo deve retornar o objeto de empréstimo', () => {
    const user = new User('u3', 'João');
    user.borrow('Livro C');
    const info = user.getLoanInfo('Livro C');
    expect(info).toHaveProperty('borrowDate');
    expect(info).toHaveProperty('returnDate', null);
  });
});

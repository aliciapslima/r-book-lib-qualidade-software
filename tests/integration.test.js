const LibraryService = require('../services/LibraryService');
const InMemoryRepository = require('../repos/InMemoryRepository');

describe('Integration happy path - LibraryService with InMemoryRepository', () => {
  it('should execute main flows: register, borrow, return, remove, reports', () => {
    const repo = new InMemoryRepository();
    const lib = new LibraryService(repo);

    // register books and users
    lib.registerBook('A', 'Author A', 2);
    lib.registerBook('B', 'Author B', 1);
    lib.registerUser('u1', 'User One');

    // listBooks
    const books = lib.listBooks();
    expect(books.length).toBe(2);

    // borrow A
    const borrowOk = lib.borrowBook('u1', 'A');
    expect(borrowOk).toBe(true);

    // get availability
    const report1 = lib.getAvailabilityReport();
    expect(report1.totalBorrowed).toBeGreaterThanOrEqual(1);

    // borrow another A
    lib.registerUser('u2', 'User Two');
    lib.borrowBook('u2', 'A');

    // now A should be out of stock
    expect(() => lib.borrowBook('u1', 'A')).toThrow();

    // return A from u1
    const loan = lib.returnBook('u1', 'A');
    expect(loan).toHaveProperty('borrowDate');
    expect(loan).toHaveProperty('returnDate');

    // listLoans for u2 (should have active loan)
    const loansU2 = lib.listLoans('u2');
    expect(Array.isArray(loansU2)).toBe(true);
    expect(loansU2.length).toBeGreaterThanOrEqual(1);

    // remove book B (all copies available)
    const removed = lib.removeBook('B');
    expect(removed).toBe(true);
  });
});

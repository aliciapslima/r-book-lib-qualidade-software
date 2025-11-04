// services/LibraryService.js
const Book = require("../models/Book");
const User = require("../models/User");

class LibraryService {
  constructor(repository) {
    this.repo = repository;
  }

  // --- Book operations ---
  registerBook(title, author, quantity = 1) {
    if (this.repo.findBook(title)) {
      throw new Error("Livro já existe na biblioteca");
    }
    const book = new Book(title, author, quantity);
    this.repo.addBook(book);
    return book;
  }

  listBooks() {
    return this.repo.listBooks();
  }

  removeBook(title) {
    const book = this.repo.findBook(title);
    if (!book) throw new Error("Livro não encontrado");
    if (book.quantity !== book.originalQuantity) {
      throw new Error("Não é possível remover: há exemplares emprestados");
    }
    this.repo.removeBook(title);
    return true;
  }

  // --- User operations ---
  registerUser(id, name) {
    if (this.repo.findUser(id)) {
      throw new Error("Usuário já cadastrado");
    }
    const user = new User(id, name);
    this.repo.addUser(user);
    return user;
  }

  listUsers() {
    return this.repo.listUsers();
  }

  removeUser(id) {
    const user = this.repo.findUser(id);
    if (!user) throw new Error("Usuário não encontrado");
    
    if (user.loanCount() > 0) {
      throw new Error("Usuário possui empréstimos ativos");
    }
    
    this.repo.removeUser(id);
    return true;
  }

  // --- Loan operations ---
  borrowBook(userId, title, borrowDate = new Date()) {
    const user = this.repo.findUser(userId);
    if (!user) throw new Error("Usuário não encontrado");

    const book = this.repo.findBook(title);
    if (!book) throw new Error("Livro não encontrado");
    if (book.quantity <= 0) throw new Error("Nenhum exemplar disponível");

    // regras do usuário
    if (user.loanCount() >= 3) throw new Error("Usuário atingiu o limite de empréstimos (3)");
    if (user.hasBorrowed(book.title)) throw new Error("Usuário já tem esse livro emprestado");

    // tudo ok -> registra empréstimo com data
    book.quantity -= 1;
    user.borrow(book.title, borrowDate);
    return true;
  }

  returnBook(userId, title, returnDate = new Date()) {
    const user = this.repo.findUser(userId);
    if (!user) throw new Error("Usuário não encontrado");

    const book = this.repo.findBook(title);
    if (!book) throw new Error("Livro não encontrado");

    if (!user.hasBorrowed(book.title)) throw new Error("Usuário não emprestou este livro");

    if (book.quantity + 1 > 5) throw new Error("Quantidade máxima atingida");

    // devolução com data
    book.quantity += 1;
    const loan = user.return(book.title, returnDate);
    return loan;
  }

  getLoanDuration(userId, title) {
    const user = this.repo.findUser(userId);
    if (!user) throw new Error("Usuário não encontrado");
    
    return user.calculateLoanDuration(title);
  }

  listLoans(userId) {
    const user = this.repo.findUser(userId);
    if (!user) throw new Error("Usuário não encontrado");
    // Retorna versão estendida com datas para relatórios/histórico
    // Mantemos a possibilidade de controlar via parâmetro no futuro; por enquanto
    // devolvemos os detalhes (title, borrowDate, returnDate, isActive).
    return user.listLoans(true);
  }

  // --- Reports ---
  getAvailabilityReport() {
    const books = this.repo.listBooks();
    
    let totalBooks = 0;
    let totalBorrowed = 0;
    let totalAvailable = 0;

    for (const book of books) {
      totalBooks += book.originalQuantity;
      totalAvailable += book.quantity;
      totalBorrowed += (book.originalQuantity - book.quantity);
    }

    return {
      totalBooks: totalBooks,
      totalBorrowed: totalBorrowed,
      totalAvailable: totalAvailable,
      bookCount: books.length
    };
  }
}

module.exports = LibraryService;

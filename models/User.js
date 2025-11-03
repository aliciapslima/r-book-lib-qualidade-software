// models/User.js
class User {
  constructor(id, name) {
    if (!id) throw new Error("Identificador inválido");
    this.id = id;
    this.name = name || "";
    // loans será um Map de títulos para objetos com data de empréstimo
    // { title: { borrowDate: Date, returnDate: Date|null } }
    this.loans = new Map();
  }

  borrow(title, borrowDate = new Date()) {
    this.loans.set(title, {
      borrowDate: borrowDate,
      returnDate: null
    });
  }

  hasBorrowed(title) {
    return this.loans.has(title) && this.loans.get(title).returnDate === null;
  }

  return(title, returnDate = new Date()) {
    if (!this.loans.has(title)) {
      throw new Error("Empréstimo não encontrado");
    }
    const loan = this.loans.get(title);
    loan.returnDate = returnDate;
    return loan;
  }

  loanCount() {
    // Conta apenas empréstimos ativos (sem data de devolução)
    let count = 0;
    for (const loan of this.loans.values()) {
      if (loan.returnDate === null) {
        count++;
      }
    }
    return count;
  }

  listLoans() {
    // Retorna apenas empréstimos ativos
    const activeLoans = [];
    for (const [title, loan] of this.loans.entries()) {
      if (loan.returnDate === null) {
        activeLoans.push(title);
      }
    }
    return activeLoans;
  }

  getLoanInfo(title) {
    return this.loans.get(title);
  }

  calculateLoanDuration(title) {
    const loan = this.loans.get(title);
    if (!loan) {
      throw new Error("Empréstimo não encontrado");
    }
    
    const endDate = loan.returnDate || new Date();
    const durationMs = endDate - loan.borrowDate;
    const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));
    
    return {
      days: durationDays,
      borrowDate: loan.borrowDate,
      returnDate: loan.returnDate,
      isActive: loan.returnDate === null
    };
  }
}

module.exports = User;

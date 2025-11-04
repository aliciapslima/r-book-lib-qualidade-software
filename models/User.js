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
    // Normaliza returnDate para Date (aceita Date ou algo que Date can parse)
    const retDate = returnDate instanceof Date ? returnDate : new Date(returnDate);

    // Validação: devolução não pode ser anterior ao empréstimo
    if (retDate.getTime() < loan.borrowDate.getTime()) {
      throw new Error("Data de devolução anterior à data de empréstimo");
    }

    loan.returnDate = retDate;
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


  listLoans(details = false) {
    // Default (details = false): mantém comportamento anterior, retorna apenas títulos de empréstimos ativos
    if (!details) {
      const activeLoans = [];
      for (const [title, loan] of this.loans.entries()) {
        if (loan.returnDate === null) {
          activeLoans.push(title);
        }
      }
      return activeLoans;
    }

    // details = true: retorna histórico completo (inclui devolvidos) com informações de datas
    const loans = [];
    for (const [title, loan] of this.loans.entries()) {
      loans.push({
        title: title,
        borrowDate: loan.borrowDate,
        returnDate: loan.returnDate,
        isActive: loan.returnDate === null
      });
    }
    return loans;
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

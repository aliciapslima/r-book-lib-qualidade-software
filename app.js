// app.js
const InMemoryRepository = require("./repos/InMemoryRepository");
const LibraryService = require("./services/LibraryService");
const ui = require("./ui/consoleUI");

const repo = new InMemoryRepository();
const service = new LibraryService(repo);

function run() {
  let opt;
  do {
    opt = ui.showMenu();

    try {
      switch (opt) {
        case "1": {
          const title = ui.prompt("Título: ");
          const author = ui.prompt("Autor: ");
          const q = parseInt(ui.prompt("Quantidade: "), 10);
          service.registerBook(title, author, q);
          console.log("Livro cadastrado.");
          break;
        }
        case "2":
          console.log("Livros cadastrados:");
          service.listBooks().forEach(b => {
            console.log(`${b.title} - ${b.author} | Disponível: ${b.quantity}`);
          });
          break;
        case "3": {
          const title = ui.prompt("Título a remover: ");
          service.removeBook(title);
          console.log("Livro removido.");
          break;
        }
        case "4": {
          const id = ui.prompt("ID do usuário: ");
          const name = ui.prompt("Nome: ");
          service.registerUser(id, name);
          console.log("Usuário cadastrado.");
          break;
        }
        case "5":
          console.log("Usuários:");
          service.listUsers().forEach(u => {
            console.log(`${u.id} - ${u.name}`);
          });
          break;
        case "6": {
          const id = ui.prompt("ID do usuário a remover: ");
          service.removeUser(id);
          console.log("Usuário removido com sucesso.");
          break;
        }
        case "7": {
          const userId = ui.prompt("ID do usuário: ");
          const title = ui.prompt("Título do livro: ");
          service.borrowBook(userId, title);
          console.log("Empréstimo realizado.");
          break;
        }
        case "8": {
          const userId = ui.prompt("ID do usuário: ");
          const title = ui.prompt("Título do livro: ");
          service.returnBook(userId, title);
          console.log("Devolução realizada.");
          break;
        }
        case "9": {
          const userId = ui.prompt("ID do usuário: ");
          const loans = service.listLoans(userId);
          console.log(`Empréstimos de ${userId}: ${loans.join(", ") || "(nenhum)"}`);
          break;
        }
        case "10": {
          console.log("\n=== RELATÓRIO DE DISPONIBILIDADE ===");
          const report = service.getAvailabilityReport();
          console.log(`📚 Total de títulos cadastrados: ${report.bookCount}`);
          console.log(`📖 Total de exemplares no acervo: ${report.totalBooks}`);
          console.log(`📤 Exemplares emprestados: ${report.totalBorrowed} (${calculatePercentage(report.totalBorrowed, report.totalBooks)}%)`);
          console.log(`📥 Exemplares disponíveis: ${report.totalAvailable} (${calculatePercentage(report.totalAvailable, report.totalBooks)}%)`);
          
          if (report.totalBooks > 0) {
            console.log('\n📊 Visualização:');
            displayBar('Emprestados', report.totalBorrowed, report.totalBooks, '█');
            displayBar('Disponíveis', report.totalAvailable, report.totalBooks, '░');
          }
          console.log("=====================================");
          break;
        }
        case "0":
          console.log("Até logo!");
          break;
        default:
          console.log("Opção inválida.");
      }
    } catch (err) {
      console.log("Erro:", err.message);
    }

    if (opt !== "0") ui.pause();
  } while (opt !== "0");
}

function calculatePercentage(value, total) {
  if (total === 0) return "0.0";
  return ((value / total) * 100).toFixed(1);
}

function displayBar(label, value, total, symbol) {
  const maxBars = 30;
  const bars = total === 0 ? 0 : Math.round((value / total) * maxBars);
  const barStr = symbol.repeat(bars);
  const emptyStr = '·'.repeat(maxBars - bars);
  console.log(`  ${label.padEnd(15)} [${barStr}${emptyStr}] ${value}/${total}`);
}

if (require.main === module) {
  run();
}

module.exports = { run, service, repo };
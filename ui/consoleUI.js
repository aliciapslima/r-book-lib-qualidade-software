// ui/consoleUI.js
const prompt = require("prompt-sync")({ sigint: true });

function showMenu() {
  console.log("\n=== R Book Lib ===");
  console.log("1. Cadastrar livro");
  console.log("2. Listar livros");
  console.log("3. Remover livro");
  console.log("4. Cadastrar usuário");
  console.log("5. Listar usuários");
  console.log("6. Remover usuário");
  console.log("7. Emprestar livro");
  console.log("8. Devolver livro");
  console.log("9. Listar empréstimos de usuário");
  console.log("10. Relatório de disponibilidade");
  console.log("0. Sair");
  return prompt("Escolha uma opção: ");
}

function pause() {
  prompt("Enter para continuar...");
}

module.exports = { showMenu, pause, prompt };
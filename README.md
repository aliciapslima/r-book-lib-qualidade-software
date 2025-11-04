# R Book Lib — Sistema de Biblioteca (Atividade de Qualidade de Software)

INSTITUTO FEDERAL DE ALAGOAS – IFAL / CAMPUS MACEIÓ
Curso: Bacharelado em Sistemas de Informação
Disciplina: Qualidade de Software
Professor: Prof. MSc. Ricardo Nunes (Ricardo@ifal.edu.br)

Projeto: R Book Lib (atividade de testes unitários com Jest)

Resumo da atividade

Objetivo geral

Escrever testes unitários usando Jest para validar regras de negócio do módulo de domínio/serviço do Sistema de Biblioteca R Book Lib — sem testar a interface do console.

Descrição do que foi realizado

- Implementação / verificação das regras de negócio na camada `services/LibraryService.js` e modelos em `models/`.
- Testes unitários escritos com Jest para cobrir cadastro de livros, cadastro de usuários, empréstimos, devoluções e remoções conforme os critérios da atividade.
- Implementação de pequenas evoluções: registro de data de empréstimo e devolução, validação que impede devolução com data anterior ao empréstimo e retorno de histórico detalhado de empréstimos.
- Execução de relatório de cobertura via Jest --coverage.

Arquivos principais do projeto

- `app.js` — entrypoint do console (UI baseada em prompt-sync).
- `ui/consoleUI.js` — helpers de entrada/saída no console.
- `models/Book.js`, `models/User.js` — modelos do domínio.
- `repos/InMemoryRepository.js` — repositório em memória (livros e usuários).
- `services/LibraryService.js` — regras de negócio (cadastro, empréstimo, devolução, relatórios).
- `tests/` — testes Jest (ex.: `libraryService.test.js`, `user.test.js`, `book.test.js`).
- `examples/` — exemplos de uso (scripts que usam `LibraryService`).
- `docs/` — documentos: relatórios e descrição de história de usuário.

Pré-requisitos (local)

- Node.js (recomendado v16+)
- npm

Instalação

1. Inicialize o projeto (se necessário):

```bash
npm init -y
```

2. Instale dependências:

```bash
npm install
# (prompt-sync já está nas dependências do projeto)

# Instale dependências de desenvolvimento (Jest)
npm install --save-dev jest
```

(Observação: este repositório já tem `package.json` com `jest` em `devDependencies`.)

Scripts úteis (package.json)

- `npm start` — inicia a interface de console (arquivo `app.js`).
- `npm test` — executa os testes com Jest.

Rodando os testes

```bash
# roda os testes
npm test
```

Relatório de cobertura

Para gerar o relatório de cobertura (texto resumido + arquivos em `coverage/`):

```bash
# gera cobertura e imprime resumo
npm test -- --coverage --coverageReporters=text-summary

# gera cobertura (padrão) e cria relatório HTML em coverage/lcov-report/index.html
npm test -- --coverage
```

Abrindo o relatório HTML localmente

Se `xdg-open` ou o atalho do sistema dá erro (algumas instalações via snap podem apresentar mensagem sobre `libstdc++`), você pode abrir com um navegador diretamente ou servir o diretório:

```bash
# abrir com Firefox
firefox coverage/lcov-report/index.html &

# abrir com Chromium/Chrome
chromium coverage/lcov-report/index.html &
# ou
google-chrome coverage/lcov-report/index.html &

# ou servir por HTTP (útil se quiser abrir em outro dispositivo):
python3 -m http.server --directory coverage/lcov-report 8000
# depois abra http://localhost:8000 no navegador
```

Observação sobre o ambiente

- Se ao abrir o relatório via `xdg-open` aparecer erro relacionado a `libstdc++` ou `giolibproxy` (comuns em instalações via snap), isso é problema do ambiente/snap e não afeta o relatório gerado; abra o arquivo diretamente em um navegador.

Critérios de aceitação e cobertura da atividade

A suíte de testes do repositório valida os seguintes cenários exigidos pela atividade (entre outros):

Parte 1 — Testes unitários do `LibraryService` (regras de negócio)
- Cadastro de livro
  - Tentar cadastrar livro com título duplicado — lança erro.
  - Cadastrar livro com quantidade inválida (<= 0) — lança erro.
- Cadastro de usuário
  - Cadastrar usuário com identificador duplicado — lança erro.
- Empréstimo
  - Emprestar livro inexistente — erro.
  - Emprestar com quantidade 0 — erro.
  - Emprestar para usuário inexistente — erro.
  - Usuário com 3 livros já emprestados — erro.
  - Usuário que já tem o mesmo livro emprestado — erro.
  - Empréstimo bem-sucedido: desconta quantidade e registra empréstimo do usuário.
- Devolução
  - Devolver livro que o usuário não emprestou — erro.
  - Devolver quando livro não existe — erro.
  - Devolução que excederia quantidade máxima (5) — erro.
  - Devolução bem-sucedida: incrementa quantidade no repositório e registra data de devolução.
- Remoção
  - Remover livro com exemplares emprestados — erro.
  - Remover livro com todas as cópias disponíveis — sucesso.

Parte 2 — Implementações/funcionalidades adicionadas (mínimo 3)
- Registro automático de data de empréstimo (já estava presente)
- Registro e validação de data de devolução (não pode ser anterior ao empréstimo)
- `listLoans(details = true)` — retorno de histórico/detalhado com `borrowDate`, `returnDate` e `isActive`

Parte 3 — Cobertura
- Foi executado Jest com `--coverage` e o relatório foi gerado em `coverage/`.
- Meta recomendada (sugerida): >= 80% lines/statements para este exercício.

Parte 4 — Relatório de testes
- Um documento `docs/HU11-Registrar-Data-Emprestimo-Devolucao.md` foi adicionado descrevendo as mudanças e verificação.
- Você pode adicionar `docs/relatorio.md` com um resumo adicional dos resultados, se quiser (posso gerar automaticamente um rascunho para acompanhar os resultados dos testes e cobertura).

Sugestões e próximos passos

- Definir thresholds de cobertura no `package.json` (opcional) para proteger regressões no CI.
- Se desejar, posso:
  - Adicionar um `npm script` que serve o relatório HTML localmente (ex.: `npm run coverage:serve`).
  - Gerar `docs/relatorio.md` com um pequeno resumo automático dos testes e cobertura atual.
  - Criar instruções para enviar este trabalho (zip/zip deploy) ou preparar para entrega.

Contato / ajuda

Se quiser que eu gere o `relatorio.md` automaticamente com os resultados atuais dos testes e cobertura, ou adicione thresholds no `package.json` e um script para servir o relatório HTML, diga qual opção prefere e eu aplico as mudanças.

---
Arquivo gerado automaticamente em: 04/11/2025
Branch: feature/evolucoes-nf02-nf05-nf08

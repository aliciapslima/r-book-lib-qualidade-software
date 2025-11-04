# R Book Lib — Sistema de Biblioteca (Atividade de Qualidade de Software)

**Projeto**: R Book Lib (atividade de testes unitários com Jest)

**Objetivo geral**: Escrever testes unitários usando Jest para validar regras de negócio do módulo de domínio/serviço do Sistema de Biblioteca R Book Lib.

**Descrição do que foi realizado:**

- Implementação / verificação das regras de negócio na camada `services/LibraryService.js` e modelos em `models/`.
- Testes unitários escritos com Jest para cobrir cadastro de livros, cadastro de usuários, empréstimos, devoluções e remoções conforme os critérios da atividade.
- Implementação de pequenas evoluções: registro de data de empréstimo e devolução, validação que impede devolução com data anterior ao empréstimo e retorno de histórico detalhado de empréstimos.
- Execução de relatório de cobertura via Jest --coverage.

**Arquivos principais do projeto:**

- `app.js` — entrypoint do console (UI baseada em prompt-sync).
- `ui/consoleUI.js` — helpers de entrada/saída no console.
- `models/Book.js`, `models/User.js` — modelos do domínio.
- `repos/InMemoryRepository.js` — repositório em memória (livros e usuários).
- `services/LibraryService.js` — regras de negócio (cadastro, empréstimo, devolução, relatórios).
- `tests/` — testes Jest (ex.: `libraryService.test.js`, `user.test.js`, `book.test.js`).
- `docs/` — documentos: relatórios.

**Pré-requisitos (local):**

- Node.js (recomendado v16+)
- npm

**Instalação**

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

**Scripts úteis (package.json)**

- `npm start` — inicia a interface de console (arquivo `app.js`).
- `npm test` — executa os testes com Jest.

**Rodando os testes**

```bash
# roda os testes
npm test
```

**Relatório de cobertura**

Para gerar o relatório de cobertura (texto resumido + arquivos em `coverage/`):

```bash
# gera cobertura e imprime resumo
npm test -- --coverage --coverageReporters=text-summary

# gera cobertura (padrão) e cria relatório HTML em coverage/lcov-report/index.html
npm test -- --coverage
```

### Equipe:
[Alicia Lima](https://github.com/aliciapslima/)<br>
 [Antony Thiago](https://github.com/antonyt8)<br>
[Ezequiel Cavalcante](https://github.com/EzequielCavalcante)<br>
[Ester Andrade](https://github.com/esterandr02)<br>
[Rayanne Gomes](http://github.com/rayannegomes)<br>

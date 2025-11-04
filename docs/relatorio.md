# Relatório de Testes — R Book Lib

Data: 04/11/2025
Branch: feature/evolucoes-nf02-nf05-nf08

Resumo executivo

Esta atividade implementou testes unitários e gerou relatório de cobertura para o projeto R Book Lib (atividade da disciplina de Qualidade de Software - IFAL).

Execução dos testes

- Test Suites: 3
- Testes: 36
- Status: todos passaram

Resultados (cobertura - resumo)

- Statements: 82.92% (102/123)
- Branches:   76.05% (54/71)
- Functions:  85.71% (18/21)
- Lines:      85.04% (91/107)

Detalhes importantes

Arquivos com linhas não cobertas (exemplos):
- `services/LibraryService.js` — linhas não cobertas: 16-21, 39-45, 104-109 (caminhos de erro não inventariados nos testes atuais).
- `models/User.js` — linhas não cobertas: 24, 54-60 (alguns ramos e caminhos auxiliares).

Observações sobre o ambiente

- O relatório HTML foi gerado em `coverage/lcov-report/index.html`.
- Se `xdg-open` falhar devido a problemas com snaps (`libstdc++` / `giolibproxy`), abra o `index.html` diretamente com o navegador ou sirva o diretório com `python3 -m http.server --directory coverage/lcov-report 8000`.

Ações realizadas

1. Escrita/execução de testes unitários para `LibraryService` (regras de negócio).
2. Adição de testes para `models/User` e `models/Book` cobrindo validações e comportamento de datas.
3. Implementação de pequenas evoluções no código (registro de datas de empréstimo/devolução, validação de datas e lista de empréstimos detalhada).
4. Geração do relatório de cobertura com Jest.
5. Inclusão de `README.md` e `docs/HU11-Registrar-Data-Emprestimo-Devolucao.md` descrevendo a implementação.

Recomendações

- Cobrir os ramos restantes em `LibraryService.js` com testes que forcem os fluxos de erro listados nas linhas não cobertas.
- Estabelecer thresholds de cobertura em `package.json` (já adicionados) para proteger regressões no CI.

Como reproduzir

```bash
# instalar dependências
npm install

# rodar todos os testes
npm test

# gerar cobertura (texto resumido)
npm test -- --coverage --coverageReporters=text-summary

# gerar relatório HTML
npm test -- --coverage
```

Relatório gerado automaticamente por script de apoio.

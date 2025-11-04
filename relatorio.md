Parte 1: Realização de Testes

Seção: LibraryService - Livros

        Teste: Registrar livro com título duplicado (RN01)

            O repositório é configurado para simular que o livro já existe.

            Espera-se que o método registerBook lance o erro "Livro já existe na biblioteca".

            Resultado: Erro corretamente lançado e addBook não é chamado.

        Teste: Registrar livro com quantidade inválida (<= 0)

            O repositório indica que o livro ainda não existe.

            A quantidade informada é zero.

            Espera-se erro "Quantidade deve ser positiva".

            Resultado: Erro corretamente lançado e addBook não é chamado.

        Teste: Remover livro com exemplares emprestados

            O livro possui quantidade atual menor que a original (há exemplares emprestados).

            Espera-se erro "Não é possível remover: há exemplares emprestados".

            Resultado: Erro corretamente lançado e removeBook não é chamado.

        Teste: Remover livro com todas as cópias disponíveis

            O livro está completamente disponível.

            Espera-se que o método removeBook seja executado com sucesso.

            Resultado: Remoção bem-sucedida, removeBook chamado uma vez com o título correto.

Seção: LibraryService - Usuários

        Teste: Cadastrar usuário com identificador duplicado

            O repositório indica que o usuário já existe.

            Espera-se erro "Usuário já cadastrado".

            Resultado: Erro corretamente lançado e addUser não é chamado.

Seção: LibraryService - Empréstimos

        Teste: Emprestar livro inexistente

            O usuário existe, mas o livro não.

            Espera-se erro "Livro não encontrado".

            Resultado: Erro corretamente lançado.

        Teste: Emprestar livro com quantidade igual a 0

            O livro existe, porém sem exemplares disponíveis.

            Espera-se erro "Nenhum exemplar disponível".

            Resultado: Erro corretamente lançado.

        Teste: Emprestar livro para usuário inexistente

            O usuário não existe no repositório.

            Espera-se erro "Usuário não encontrado".

            Resultado: Erro corretamente lançado.

        Teste: Usuário com 3 livros já emprestados

            O usuário tem exatamente 3 livros emprestados.

            Espera-se erro "Usuário atingiu o limite de empréstimos (3)".

            Resultado: Erro corretamente lançado.

        Teste: Usuário já possui o mesmo livro emprestado

            O usuário já possui o título "1984" emprestado.

            Espera-se erro "Usuário já tem esse livro emprestado".

            Resultado: Erro corretamente lançado.

        Teste: Empréstimo bem-sucedido

            Usuário sem empréstimos e livro disponível com quantidade 3.

            Espera-se que o empréstimo seja concluído com sucesso.

            Resultado:

            Método retorna true;

            Quantidade do livro reduzida para 2;

            Livro adicionado ao histórico de empréstimos do usuário.

Seção: LibraryService - Devoluções

        Teste: Devolver livro que o usuário não emprestou

            O usuário não tem o livro registrado em seus empréstimos.

            Espera-se erro "Usuário não emprestou este livro".

            Resultado: Erro corretamente lançado.

        Teste: Devolver livro inexistente

            O livro não está no repositório.

            Espera-se erro "Livro não encontrado".

            Resultado: Erro corretamente lançado.

        Teste: Devolução excederia quantidade máxima (5)

            O livro já tem quantidade máxima de exemplares disponíveis.

            Espera-se erro "Quantidade máxima atingida".

            Resultado: Erro corretamente lançado.

        Teste: Devolução bem-sucedida

            Usuário possui o livro emprestado e há espaço para devolução.

            Espera-se que a devolução seja processada corretamente.

            Resultado:

            Método retorna true;

            Quantidade do livro aumentada;

            Livro removido do histórico do usuário;

            Usuário fica sem empréstimos ativos.

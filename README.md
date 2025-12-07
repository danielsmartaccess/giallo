# Giallo Sanduicheria

Site estatico de cardapio criado para apresentar os paninis da Giallo Sanduicheria em Porto Alegre. O projeto usa apenas HTML, CSS e JavaScript puro e foi pensado para ser hospedado no GitHub Pages sem etapas de build.

## Conteudo principal

- **Hero + navegacao fixa** para destacar a proposta de valor e permitir acesso rapido ao cardapio e contato.
- **Grade de sanduiches totalmente responsiva** com precos, tags (vegetariano, sazonal) e descricoes.
- **Filtro inteligente por ingredientes**: chips interativos limitados a tres escolhas sincronizam o painel de sugestoes e escondem combinacoes impossiveis.
- **Busca textual em tempo real** e destaque visual do card correspondente quando so resta uma opcao.
- **Botoes "Pedir agora"** com deep links do WhatsApp otimizados para Android, iOS ou navegadores desktop.
- **Dados estruturados JSON-LD** para ajudar buscadores a entenderem o menu da sanduicheria.

## Estrutura do projeto

```text
.
├── index.html         # markup principal e JSON-LD do cardapio
├── css/
│   └── style.css      # tema, layout responsivo e estilos dos filtros
├── js/
│   └── script.js      # logica de filtros, busca e links do WhatsApp
└── images/            # logos e fotos dos paninis
```

## Como executar localmente

1. Clone o repositorio: `git clone https://github.com/danielsmartaccess/giallo.git`
2. Entre na pasta `giallo_site/giallo_site`.
3. Abra `index.html` diretamente no navegador ou rode uma extensao Live Server (VS Code, por exemplo) para ter recarregamento automatico.
4. Certifique-se de manter a estrutura de pastas; os caminhos relativos ja apontam para `css/`, `js/` e `images/`.

## Deploy no GitHub Pages

1. Garanta que `main` contenha os arquivos atualizados.
2. Acesse **Settings → Pages** no repositorio `giallo`.
3. Em **Build and deployment**, escolha "Deploy from a branch".
4. Selecione branch `main` e pasta `/ (root)` e clique em **Save**.
5. Aguarde o workflow `pages-build-deployment` concluir (acompanhe em **Actions**).
6. O site ficara disponivel em `https://danielsmartaccess.github.io/giallo/`.

### Dicas pos-deploy

- Use a guia **Pages** para copiar a URL publica e compartilhar.
- Em **Settings → Pages**, configure um dominio personalizado se desejar; o GitHub criara o arquivo `CNAME` automaticamente.
- Habilite "Enforce HTTPS" apos o dominio propagar.

## Personalizacao

- Atualize o cardapio em `index.html` e `script.js` (lista `sandwiches`) para manter filtros e dados sincronizados.
- As cores principais ficam em `:root` dentro de `css/style.css`, facilitando ajustes de identidade visual.
- As imagens sao carregadas do diretorio `images/`; mantenha proporcao semelhante (square) para preservar o layout da grade.

## Licenca

Este projeto foi criado para fins internos da Giallo Sanduicheria. Ajuste a licenca conforme necessario antes de distribuirmos o codigo publicamente.

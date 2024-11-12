# TigHub

TigHub é um estudo de clone do GitHub, uma plataforma para hospedar e compartilhar repositórios de código-fonte. Este projeto foi criado para fornecer uma interface simples e intuitiva para gerenciar repositórios, perfis de usuários e muito mais.

## Funcionalidades

- **Busca de Repositórios**: Pesquise repositórios com base em linguagens de programação e estrelas.
- **Perfis de Usuários**: Visualize perfis de usuários e seus repositórios públicos.
- **Cache de Dados**: Utilize cache para armazenar temporariamente os dados e melhorar o desempenho.
- **Ordenação de Repositórios**: Ordene repositórios por data de criação, estrelas ou forks.
- **Limpeza de Cache**: Limpe o cache manualmente quando necessário.

## Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Tailwind CSS**: Framework CSS para estilização rápida e responsiva.
- **JavaScript**: Utilizado para desenvolvimento de funcionalidades do front-end.
- **React Hot Toast**: Biblioteca para exibição de notificações.

## Estrutura do Projeto

```
tighub/
├── .env
├── .gitignore
├── .prettierrc
├── backend/
└── frontend/
    ├── .env
    ├── bun.lockb
    ├── eslint.config.js
    ├── index.html
    ├── lib/
    │   └── function.js
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── public/
    │   ├── bg.png
    │   ├── c++.svg
    │   ├── csharp.svg
    │   ├── css.svg
    │   ├── github.svg
    │   ├── go.svg
    │   ├── html.svg
    │   ├── java.svg
    │   ├── javascript.svg
    │   ├── logo.png
    │   ├── python.svg
    │   ├── swift.svg
    │   ├── typescript.svg
    │   └── vite.svg
    ├── README.md
    ├── src/
    │   ├── api/
    │   │   └── github.js
    │   ├── App.jsx
    │   ├── assets/
    │   │   └── react.svg
    │   ├── components/
    │   │   ├── IconComponent.jsx
    │   │   ├── Logout.jsx
    │   │   ├── ProfileInfo.jsx
    │   │   ├── Repo.jsx
    │   │   ├── Repos.jsx
    │   │   ├── Search.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── SortRepos.jsx
    │   │   └── Spinner.jsx
    │   ├── index.css
    │   ├── main.jsx
    │   ├── pages/
    │   │   ├── ExplorePage.jsx
    │   │   ├── HomePage.jsx
    │   │   ├── LikesPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   └── SignupPage.jsx
    │   └── utils/
    │       └── functions.js
    ├── tailwind.config.js
    └── vite.config.js
```
Como Executar o Projeto
Clone o repositório:


```git clone https://github.com/usuario/tighub.git```
Navegue até o diretório do projeto:

```cd tighub/frontend```
Instale as dependências:

```npm install```
Inicie o servidor de desenvolvimento:

```npm start```
Abra o navegador e acesse:

http://localhost:3000
Configuração do Ambiente
Certifique-se de configurar as variáveis de ambiente no arquivo .env:

```VITE_GITHUB_TOKEN=your_github_personal_access_token```
Contribuições
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

Licença
Este projeto é licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

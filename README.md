# TiGHub

TiGHub é uma aplicação web que permite explorar e interagir com perfis e repositórios do GitHub.

## Recursos

- Autenticação com GitHub
- Explorar perfis de usuários
- Visualizar e interagir com repositórios
- Sistema de likes para usuários e repositórios
- Suporte a múltiplos idiomas (i18n)
- Tema claro/escuro

## Tecnologias

- Frontend: JavaScript (Vanilla), Vite, TailwindCSS
- Backend: Node.js, Express, MongoDB
- Autenticação: Passport.js com GitHub OAuth

## Configuração

1. Clone o repositório:

```bash
git clone https://github.com/marcythany/tighub.git
cd tighub
```

2. Instale as dependências:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env` no diretório backend
   - Preencha as variáveis necessárias:
     - `MONGO_URI`: URL de conexão do MongoDB
     - `SESSION_SECRET`: Chave secreta para as sessões
     - `GITHUB_CLIENT_ID`: ID do cliente OAuth do GitHub
     - `GITHUB_CLIENT_SECRET`: Chave secreta do OAuth do GitHub
     - `CORS_ORIGINS`: Lista de origens permitidas (separadas por vírgula)

4. Inicie o projeto em desenvolvimento:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Deploy

Para fazer deploy no Render:

1. Conecte seu repositório ao Render
2. Configure as variáveis de ambiente no dashboard do Render
3. O deploy será automático a cada push na branch principal

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

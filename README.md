# TiGitHub

## 📋 Sobre o Projeto

TiGitHub é uma aplicação web que integra com o GitHub, oferecendo funcionalidades adicionais para gerenciamento de repositórios e colaboração.

## 🚀 Tecnologias Utilizadas

### Frontend

- Vite.js como build tool
- TailwindCSS para estilização
- Jest para testes
- Babel para transpilação
- Sistema de componentes modular

### Backend

- Node.js com Express
- MongoDB para banco de dados
- Autenticação via GitHub OAuth
- Sistema de rotas organizado
- Middleware de autenticação
- Arquitetura MVC

## 🏗️ Estrutura do Projeto

### Frontend (`/frontend`)

- `/css` - Estilos globais
- `/js` - Scripts e componentes JavaScript
- `/pages` - Páginas da aplicação
- `/public` - Arquivos estáticos
- `/styles` - Estilos específicos de componentes

### Backend (`/backend`)

- `/config` - Configurações do servidor e banco de dados
- `/controllers` - Controladores da aplicação
- `/middleware` - Middlewares personalizados
- `/models` - Modelos do banco de dados
- `/routes` - Rotas da API
- `/services` - Serviços da aplicação
- `/passport` - Configuração de autenticação

## 🔧 Configuração e Instalação

### Pré-requisitos

- Node.js
- MongoDB
- Conta no GitHub para autenticação OAuth

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
# Configure o arquivo .env baseado no .env.example
npm start
```

## 🔑 Variáveis de Ambiente

O backend requer as seguintes variáveis de ambiente:

- `MONGO_URI`: URL de conexão com MongoDB
- `SESSION_SECRET`: Chave secreta para sessões
- `GITHUB_CLIENT_ID`: ID do cliente GitHub OAuth
- `GITHUB_CLIENT_SECRET`: Chave secreta do GitHub OAuth
- `FRONTEND_URL`: URL do frontend
- `CORS_ORIGINS`: Origens permitidas para CORS

## 📦 Scripts Disponíveis

### Frontend

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera build de produção
- `npm run preview`: Visualiza build de produção
- `npm test`: Executa testes
- `npm run test:watch`: Executa testes em modo watch
- `npm run test:coverage`: Gera relatório de cobertura de testes

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

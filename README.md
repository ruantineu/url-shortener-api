# URL Shortener API

Uma API REST para encurtar URLs, construída com Node.js, Express e PostgreSQL.

## Features
- Registro e autenticação de usuários com JWT.
- Encurtamento de URLs (URLs curtas com 6 caracteres) para usuários autenticados e não autenticados.
- Usuários autenticados podem listar, atualizar e excluir logicamente suas URLs.
- Rastreamento de cliques para cada URL encurtada.
- Exclusão lógica com o campo deleted_at.
- Validação de entrada, limitação de taxa (rate limiting) e cabeçalhos de segurança.
- Documentação da API com Swagger.

## Pré-requisitos
- Node.js (versão LTS, ex: v18.x)
- PostgreSQL (v14 ou superior)
- npm ou yarn

## Configuração e Execução

1. Clone o repositório:
   ```bash
   git clone <repository_url>
   cd url-shortener
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie o arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```
   DB_NAME=url_shortener
   DB_USER=postgres
   DB_PASSWORD=sua_senha_segura
   DB_HOST=localhost
   DB_PORT=5432
   JWT_SECRET=seu_jwt_secret_seguro
   PORT=3000
   BASE_URL=http://localhost:3000
   ```

4. Certifique-se de que o PostgreSQL está instalado e rodando em sua máquina

5. Crie o banco de dados:
   ```bash
   createdb url_shortener
   ```

6. Inicie o servidor:
   ```bash
   npm run dev
   ```

7. A API estará disponível em `http://localhost:3000`

## Documentação da API

A documentação da API está disponível através do Swagger UI em:
```
http://localhost:3000/api-docs
```

## Principais Endpoints

- `POST /auth/register` - Registro de usuário
- `POST /auth/login` - Login de usuário
- `POST /urls` - Criar URL encurtada
- `GET /urls/:shortCode` - Redirecionar para URL original
- `GET /urls` - Listar URLs do usuário (requer autenticação)
- `PUT /urls/:id` - Atualizar URL (requer autenticação)
- `DELETE /urls/:id` - Excluir URL (requer autenticação)

## Desenvolvimento

### Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` - Compila o projeto
- `npm start` - Inicia o servidor em modo produção
- `npm test` - Executa os testes
- `npm run lint` - Executa o linter

### Estrutura do Projeto 

```
src/
  ├── config/         # Configurações da aplicação
  ├── controllers/    # Controladores da API
  ├── middleware/     # Middlewares
  ├── models/         # Modelos do banco de dados
  ├── routes/         # Rotas da API
  ├── services/       # Lógica de negócios
  ├── utils/          # Utilitários
  └── app.ts          # Arquivo principal
```

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
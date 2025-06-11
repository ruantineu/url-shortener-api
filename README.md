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

## Prerequisites
- Node.js (LTS version, e.g., v18.x)
- PostgreSQL (v14 or higher)
- npm

## Setup
1. Clone o repositório:
   ```bash
   git clone <repository_url>
   cd url-shortener
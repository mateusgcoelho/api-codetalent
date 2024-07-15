# API-CODETALENT

Versão: 0.0.1
Esta API fornece uma interface completa para gerenciar produtos e preços de venda em um ambiente multi-loja.

# Configuração de Ambiente

Para configuração do ambiente, basta duplicar o arquivo `.env.dev`, renomea-lo para `.env` e alterar as informações com base nas suas credenciais, variáveis necessárias:

```javascript
// Informações do servidor
SERVER_PORT = 3000;

// Informações do banco de dados
DATABASE_NAME = codetalent;
DATABASE_USERNAME = postgres;
DATABASE_PASSWORD = Docker;
DATABASE_HOST = localhost;
DATABASE_PORT = 5432;
```

---

Para iniciar a aplicação basta utilizar o comando abaixo:

```bash
npm run docker
```

Ou:

```bash
docker-compose up -d --build
```

## Documentação

Para ter uma visão geral das rotas disponíveis no serviço basta, depois de serviço iniciado, acessar a rota `/api/docs`, sendo possível ter uma documentação swagger com rotas dispoíveis.

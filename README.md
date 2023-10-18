# README 
## Configurar o projeto

Será nescessário instalar as dependencias

```bash
$ yarn install
$ npm install prisma --save-dev
```

É preciso criar um arquivo na raiz do projeto, para colocar variáveis de ambiente, chamado ``` .env ```
```typescript
DATABASE_URL = url de conexão com o postgresql

ACCESS_KEY_TOKEN = coloque uma chave criptografada

ACCESS_KEY_TOKEN_REFRESH = coloque uma chave criptografada diferente da chave interior

PORT = coloque sua porta de preferencia (opcional)
```

Para iniciar a API use o comando 

```bash
$ yarn dev
```
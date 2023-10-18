# README 
## Configurar o projeto

Será nescessário instalar as dependencias

```bash
$ yarn install
$ npm install prisma --save-dev
```

É preciso criar um arquivo na raiz do projeto, para colocar variáveis de ambiente, chamado ` .env `
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

## Endpoints Usuário
#### `._base_url = http://localhost:3000`

### Para fazer o signup de usuário: 
 
 ```json
_.base_url/users
```
#### Será passado os parametros:

```json
{
	"name": "nome qualquer",
	"email": "email qualquer",
	"password": "senha qualquer"
}
```
#### Resposta
```json
{
	"id": "uuid",
	"email": "email passado",
	"password": "hash",
	"name": "nome passado"
}
```


### Para fazer a autenticação de usuário: 
 
 ```json
_.base_url/users/auth
```
#### Será passado os parametros:
```json
{
	"email": "email de criação",
	"password": "senha de criação"
}
```
#### Resposta
```json
{
	"token": "chave token gerada",
	"refresh_token": "chave para atualizar o token caso expire",
	"user": {
		"name": "nome passado",
		"email": "email passado"
	}
}
```


### Para atualizar o token caso expire: 
 
 ```json
_.base_url/users/refresh
```
#### Será passado os parametros:
```json
{
	"refresh_token": "refresh_token gerado pela autenticação"
}
```
#### Resposta
```json
{
	"token": "novo token gerado",
	"refresh_token": "novo refresh_token gerado"
}
```
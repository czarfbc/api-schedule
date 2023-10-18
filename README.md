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
Método `POST`
 
 ```
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
 Método `POST`

 ```
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
Método `POST`

 
 ```
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




## Endpoints Agenda
#### `._base_url = http://localhost:3000`

### Para criar um agendamento: 
Método `POST`

 
 ```
_.base_url/schedules
```
#### Será passado os parametros juntamente ao bearer token:

```json
{
	"name": "nome do cliente",
	"phone": "opcional",
    "description": "opcional",
	"date": "data no formato: Timestamp => ISO-8601"
}
```
#### Resposta
```json
{
	"id": "id da agenda criada",
	"name": "nome do cliente dado",
	"phone": "se passado vai ser retornado",
	"description": "se passado vai ser retornado",
	"date": "data passada",
	"user_id": "id do usuário que criou a agenda"
}
```


### Para fazer a atualização de um agendamento: 
Método `PATCH`

 
 ```
_.base_url/schedules/:id_do_agendamento
```
#### Será passado os parametros juntamente ao bearer token:
```json
{
	"name": "opcional",
	"phone": "opcional",
	"description": "opcional",
	"date": "opcional"
}
```
#### Resposta
```json
{
	"id": "id_do_agendamento",
	"name": "nome passado ou original",
	"phone": "phone passado ou original",
	"description": "desrição passada ou original",
	"date": "data passada ou original",
	"user_id": "id do usuario que solicitou atualização"
}
```


### Para excluir um agendamento: 
Método `DELETE`

 
 ```
_.base_url/schedules/:id_do_agendamento
```
#### Será passado o bearer token:

#### Resposta
```
HttpStatusCode(204)
```


### Para buscar todos os agendamentos do dia: 
Método `GET`

 
 ```
_.base_url/schedules
```
#### Será passado o bearer token:

#### Resposta
Vai ser passado o seguite array de objetos, a quantidade de objeto será respectivo à quantidade de agendamentos que tiver no dia
```json
[
	{
        "id": "id da agenda criada",
        "name": "nome do cliente dado",
        "phone": "se passado vai ser retornado",
        "description": "se passado vai ser retornado",
        "date": "data passada",
        "user_id": "id do usuário que criou a agenda"
    }
]
```


### Para buscar todos os agendamentos: 
Método `GET`

 
 ```
_.base_url/schedules/getall
```
#### Será passado o bearer token:

#### Resposta
Vai ser passado o seguite array de objetos, a quantidade de objeto será respectivo à quantidade de agendamentos que tiver no totl
```json
[
	{
        "id": "id da agenda criada",
        "name": "nome do cliente dado",
        "phone": "se passado vai ser retornado",
        "description": "se passado vai ser retornado",
        "date": "data passada",
        "user_id": "id do usuário que criou a agenda"
    }
]
```

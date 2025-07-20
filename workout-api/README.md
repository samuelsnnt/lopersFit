# 🏋️‍♂️ Workout API

API RESTful para gerenciamento de usuários, exercícios e treinos.  
Desenvolvida com **Node.js**, **Express**, **MongoDB** e **JWT**.

---

## 📦 Tecnologias

- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- JSON Web Tokens (JWT)  
- Multer (upload de imagens, se aplicável)  

---

## ⚙️ Requisitos

- Node.js instalado  
- MongoDB rodando localmente ou em nuvem (MongoDB Atlas)  
- Variáveis de ambiente configuradas (`.env`)  

---

## 👀 Observações

- O campo `predefined` só pode ser exibido se o usuário(0) for admin(1).
- Realize uma busca no front-end na rota (`profile/collectData`) para validar se ele é admin.
- Para usuário normal o número 0(zero), já para admins o número 1(um).

---

## 🚀 Como rodar localmente

```bash
# Clone o repositório
git clone https://github.com/samuelsnnt/workout-api.git

# Entre na pasta do projeto
cd workout-api

# Instale as dependências
npm install

# Copie o exemplo de .env e configure com suas credenciais
cp .env.example .env

# Inicie o servidor em modo de desenvolvimento
npm run dev

```
---
## 🔄 **Endpoints disponíveis**

### 📝 Registro
`POST /accounts/register`  
Campos esperados:
```js
{
  username: string,
  email: string,
  password: string,
  confirmPassword: string
}
```
---

### 🔐 Login
`POST /accounts/login`  
Campos esperados:
```js
{
  username: string,
  email: string,
  password: string
}
```

---

### 🧑‍💼 Editar Perfil
`POST /profile/edit`  
Campos esperados:
```js
{
  username: string,
  email: string,
  password: string,
  newPassword: string,
  newPasswordConfirm: string
}
```

---

### 🏋️ Criar Exercício
`POST /exercises/create`  
Campos esperados:
```js
{
  nameExercise: string,
  descriptionExercise?: string,
  reps: number,
  duration?: number,
  load?: number,
  sets: number,
  predefined: ''
}
```

---

### ✏️ Editar Exercício
`POST /exercises/edit/:id`  
Campos esperados:
```js
{
  nameExercise: string,
  descriptionExercise?: string,
  reps: number,
  duration?: number,
  load?: number,
  sets: number,
  predefined: ''
}
```

> ℹ️ `descriptionExercise`, `duration` e `load` são opcionais.

---

### 🏋️‍♂️ Criar Treino
`POST /workout/create`  
Campos esperados:
```js
{
  nameWorkout: string,
  descriptionWorkout: string,
  idExercises: string[],
  predefined: ''
}
```

---

### 🛠️ Editar Treino
`POST /workout/edit/:id`  
Campos esperados:
```js
{
  nameWorkout: string,
  descriptionWorkout: string,
  idExercises: string[],
  predefined: ''
}
```

---

### 🚪 Logout
`POST /accounts/logout`  
> 🔓 Não requer campos no corpo da requisição.

---

### 🗑️ Deletar Conta
`DELETE /accounts/delete`  
> ⚠️ Sem necessidade de campos.

---

### 📥 Coletar Dados do Perfil
`POST /profile/collectData`  
> ✅ Nenhum campo necessário.

---

### 👨‍💻 Desenvolvido por
**[Samuel Santana](https://github.com/samuelsnnt/)**
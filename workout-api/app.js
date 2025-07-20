// ↓↓↓ IMPORTAÇÃO DE BIBLIOTECAS E MÓDULOS ↓↓↓
//===================================================================================================================
import express from 'express'; // Biblioteca para criar um servidor, fazer requisições, etc.
const app = express(); // Instância da aplicação Express.
import mongoose from 'mongoose'; // ODM para MongoDB: Faz a conexão e permite criar modelos de dados no Node.js
import session from 'express-session'; // Gerencia sessões de usuário(histórico do que ele fez), armazena dados entre requisições.
import bodyParser from 'body-parser'; // Disponibiliza pegarmos informações do html para o JS ou vice-versa.
import dotenv from 'dotenv'; // Ele permite que você guarde configurações sensíveis e personalizáveis (como senhas, tokens, strings de conexão, portas, etc) fora do código-fonte, de forma segura e fácil de alterar.
import flash from 'connect-flash'; // Biblioteca para criar mensagens temporárias entre requisições (flash messages).
import accountsRoutes from './routes/public/accounts.js'; // Importa todas as rotas do arquivo accounts.js
import profileRoutes from './routes/private/profile.js'; // Importa todas as rotas do arquivo profile.js
import workoutRoutes from './routes/private/workout.js'; // Importa todas as rotas do arquivo workout.js
import exercisesRoutes from './routes/private/exercises.js'; // Importa todas as rotas do arquivo exercises.js
import adminRoutes from './routes/private/admin.js'; // Importa todas as rotas do arquivo exercises.js
import authMiddleware from './middlewares/auth.js'; // Importa o middleware
import authAdmin from './middlewares/authAdmin.js'; // Importa o middleware
import cookieParser from 'cookie-parser'; // Para pegar o token do usuário que está no cookie.; 
import cors from 'cors';

// ou também pode ser feito dessa forma:
//import './models/Usuario.js'; // Requisição para usar o código do arquivo.
//const Usuario = mongoose.model('usuarios'); // Requisição da collection "usuarios".

//===================================================================================================================

// ↓↓↓ CONFIGURAÇÕES ↓↓↓
//===================================================================================================================

// ↓ Cors ↓ 
    app.use(cors({ origin: 'http://localhost:3000', credentials: true }))

// ↓ CookieParser(Para pegar o token do usuário que está no cookie.) ↓ 
    app.use(cookieParser()); 

// ↓ JSON Response ↓
    app.use(express.json()) // Recebe valores JSON

// ↓ Dotenv ↓
    dotenv.config()


// ↓ Sessão(Cookies) ↓
    app.use(session({ // Inicia o gerenciamento de sessões.
        secret:process.env.SECRET, // Senha 'extra' que protege o ID Session sendo um complemente oculto.
        resave:false, // false: Só vai salvar se for feito alguma mudança. || true: Salva a cada requisição.
        saveUninitialized:false // Salva uma sessão mesmo que ela esteja “vazia”, ou seja, sem dados atribuídos. (Boa para identificar usuários que não fizeram login, etc.)
    }));
    app.use(flash());

// ↓ Middleware(Função que intercepta toda requisição) ↓
    app.use((req, res, next) => {
        // Váriaveis globais que são utilizado por cada requisição chamada.
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        next();
    });


// ↓ Body-parser(Middleware para interpretar dados enviados em requisições como exemplos: formulários). ↓
    app.use(bodyParser.urlencoded({extended: true})); // Ler dados de formulários HTML.
    app.use(bodyParser.json()); // 	Ler dados enviados como JSON e Aceita objetos mais complexos na requisição como Arrays, objetos, etc.


// ↓ Mongoose ↓
    mongoose.Promise = global.Promise; // Permite usar a sintaxe padrão do JavaScript para resultados assíncronos do Mongoose.
    mongoose.connect('mongodb://localhost/socialfit').then(() => {
        console.log('Banco de dados conectado ao servidor com sucesso!');
    }).catch((e) => {
        console.log('Erro ao conectar ao banco de dados: '+e);
    });

//===================================================================================================================||

// ↓↓↓ ROTAS PÚBLICAS ↓↓↓
//===================================================================================================================||

// ↓ Rota de Autenticação ↓
app.use('/accounts', accountsRoutes); // Definindo a rota principal e o arquivo das sub-rotas.

// ↓↓ ROTAS PRIVADAS ↓↓↓
//===================================================================================================================||

// ↓ Rota de perfil ↓
app.use('/profile', authMiddleware, profileRoutes); // Definindo a rota principal, o middleware e o arquivo das sub-rotas.

// ↓ Rota de exercícios ↓
app.use('/exercises', authMiddleware, exercisesRoutes); // Definindo a rota principal, o middleware e o arquivo das sub-rotas.

// ↓ Rota de treinos ↓
app.use('/workout', authMiddleware, workoutRoutes); // Definindo a rota principal, o middleware e o arquivo das sub-rotas.

// ↓ Rota de admin ↓
app.use('/admin', authMiddleware, authAdmin, adminRoutes); // Definindo a rota principal, o middleware e o arquivo das sub-rotas.


// SERVIDOR(Express)  ==>>
//===================================================================================================================||
const PORT = process.env.PORT || 8089; // Se existir alguma variável chamada PORT use ela ou se não use 8089.
app.listen(PORT, (error) => {
    console.clear();
    console.log('Server connected successfully! PORT: '+PORT);
});

//===================================================================================================================||
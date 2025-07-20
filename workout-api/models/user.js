// ↓↓↓ Importações ↓↓↓
//===================================================================================================================||
import mongoose from 'mongoose';
const Schema = mongoose.Schema; // Define a estrutura de um documento dentro de uma coleção no MongoDB.

const User = new Schema({ // Crio um modelo de Schema(documento) com sua estrutura, sendo o tipo, que é requirida.
    username: {
        type: String,
        required: true
    },
    profileImageId: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    exercisesCreated: {
        type: Number,
        required: false,
        default: 0
    },
    workoutsCreated: {
        type: Number,
        required: false,
        default: 0
    },
    admin: {
        type: Boolean,
        required: false,
        default: false
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model('usuarios', User); // Criando e exportando o modelo chamada "usuarios" e definindo o modelo como a variável definida acima.
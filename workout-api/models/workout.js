// Treinos(Conjunto dos exercícios) > Exercícios(Apenas uma atividade) > Detalhes

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Workout = new Schema({
    nameWorkout: {
        type: String,
        required: true
    },
    descriptionWorkout: {
        type: String,
        required: false
    },
    idUserWorkout: {
        type: String,
        required: true
    },
    idWorkoutImage: {
        type: String,
        required: true
    },
    exercises: [{
        type: mongoose.Schema.Types.ObjectId, // Referência para os exercícios
        ref: 'exercise',  // Nome da coleção referenciada (opcional, mas útil)
        required: true
    }],
    predefined: {
        type: String,
        required: false,
        default: 'Not predefined'
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

export default mongoose.model('workouts', Workout);
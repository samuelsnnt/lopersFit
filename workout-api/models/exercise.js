import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Exercise = new Schema({
    nameExercise: {
        type: String,
        required: true
    },
    descriptionExercise: {
        type: String,
        required: false,
        default: null
    },
    reps: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: false,
        default: null
    },
    load: {
        type: Number,
        required: false,
        default: null
    },
    sets: {
        type: Number,
        required: true
    },
    idExerciseCreator: {
        type: String,
        required: true,
    },
    idExerciseImage: {
        type: String,
        required: false
    },
    predefined: {
        type: String,
        required: false,
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model('exercises', Exercise);
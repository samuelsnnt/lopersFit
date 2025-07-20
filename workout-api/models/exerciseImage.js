import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ExerciseImage = new Schema({
    exerciseId: {
        type: String,
        required: true
    },
    src: {
        type: String,
        required: true
    }
});

export default mongoose.model('exerciseImages', ExerciseImage);
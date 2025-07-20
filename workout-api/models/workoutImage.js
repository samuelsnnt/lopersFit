import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Workout = new Schema({
    workoutId: {
        type: String,
        required: true
    },
    src: {
        type: String,
        required: true
    }
});

export default mongoose.model('workoutImages', Workout)
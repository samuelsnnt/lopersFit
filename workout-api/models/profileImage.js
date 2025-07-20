import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ProfileImage = new Schema({
    userId: {
        type: String,
        required: true
    },
    src: {
        type: String,
        required: true
    }
})

export default mongoose.model('profileImages', ProfileImage)
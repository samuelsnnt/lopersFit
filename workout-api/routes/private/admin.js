import express from 'express';
import User from '../../models/user.js';
import Exercise from '../../models/exercise.js';
import Workout from '../../models/workout.js';
import Upload from '../../config/multer.js';
import { exerciseImageEdit, resizeExerciseImage } from '../../controllers/exerciseImage.js';
import { workoutImageEdit, resizeWorkoutImage } from '../../controllers/workoutImage.js';
const router = express.Router();

router.post('/addUserAdmin', async (req, res) => {
    const { email } = req.body;
    if(!email){
        res.status(400).json({msg: 'Email not provided!'});
    };

    const usuario = await User.findOne({ email: email });
    if(!usuario){
        res.status(401).json({msg: 'User not found'});
    };

    usuario.admin = true;
    try{
        await usuario.save();
        return res.status(200).json({msg: `User ${usuario.username} has been added as an administrator!`})
    }catch(e){
        return res.status(400).json({msg: `Error adding user as administrator!`})
    }
});

router.post('/removeUserAdmin', async (req, res) => {
    const { email } = req.body;
    if(!email){
        res.status(400).json({msg: 'Email not provided!'});
    };

    const usuario = await User.findOne({ email: email });
    if(!usuario){
        res.status(401).json({msg: 'User not found'});
    };

    usuario.admin = false;
    await usuario.save();
    return res.status(200).json({msg: `User ${usuario.username} has removed as an administrator!`})
});

router.post('/editExercise/:id', Upload.single('exerciseImage'), async (req, res) => {
    const exerciseId = req.params.id;
    const { nameExercise, descriptionExercise, reps, duration, load, sets } = req.body;    

    const searchUser = await User.findById(req.user.id);
    if(!searchUser) return res.status(404).json({ msg: 'User not found.' });

    const existsName = await Exercise.findOne({idExerciseCreator: req.user.id, nameExercise: nameExercise});
    if(existsName){
        return res.status(400).json({msg: 'You cannot use the same exercise names!'})
    }

    const verifyExercise = await Exercise.findOne({ _id: exerciseId });
    if(!verifyExercise){
        return res.status(404).json({msg: 'Exercise not found!'});
    }

    const exercise = verifyExercise;
    if(nameExercise) exercise.nameExercise = nameExercise;
    if(descriptionExercise) exercise.descriptionExercise = nameExercise;
    if(reps) exercise.reps = nameExercise;
    if(duration) exercise.duration = nameExercise;
    if(load) exercise.load = nameExercise;
    if(sets) exercise.sets = nameExercise;

    try {
        if(req.file) {
            const resizedImagePath = await resizeExerciseImage(req.file.path);
            req.file.path = resizedImagePath;
        }
            await exerciseImageEdit( exerciseId, req.file )
            await exercise.save()
            return res.status(201).json({ msg: "Update completed successfully!" });
    }catch (e) {
        return res.status(500).json({ msg: 'An error occurred: ' + e });
    }
});

router.post('/editWorkout/:id', Upload.single('workoutImage'), async (req, res) => {
try{
    const workoutId = req.params.id;
    const { nameWorkout, descriptionWorkout, idExercises } = req.body;

    const searchUser = await User.findById(req.user.id);
    if(!searchUser) return res.json(404).json({msg: 'User not found!'});

    const searchWorkout = await Workout.findOne({_id: workoutId});
    if(!searchWorkout) return res.status(404).json({msg: 'Workout not found!'});

    const workout = searchWorkout;
    if (nameWorkout) workout.nameWorkout = nameWorkout;
    if (descriptionWorkout) workout.descriptionWorkout = descriptionWorkout;
    if (idExercises) {
    try {
        const parsedExercises = typeof idExercises === 'string'
        ? JSON.parse(idExercises)
        : idExercises;

        // Só atualiza se tiver pelo menos um exercício
        if (Array.isArray(parsedExercises) && parsedExercises.length > 0) {
        workout.exercises = parsedExercises;
        }
    } catch (err) {
        return res.status(400).json({ msg: 'Format invalid for idExercises!' });
    }
    }
    try {
        if (req.file) {
            const resizedImagePath = await resizeWorkoutImage(req.file.path);
            req.file.path = resizedImagePath;
        }
        await workoutImageEdit(workoutId, req.file);
        await workout.save();
        return res.status(201).json({ msg: "Update completed successfully!" });
    } catch (e) {
        return res.status(500).json({ msg: 'An error occurred: ' + e });
    }
} catch(e){
    return res.status(500).json({msg: 'An error occurred while updating the user: '+e});
}
});



export default router;
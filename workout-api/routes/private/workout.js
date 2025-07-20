import express from 'express';
const router = express.Router();
import Workout from '../../models/workout.js';
import User from '../../models/user.js';
import Upload from '../../config/multer.js';
import { workoutImageCreate, workoutImageEdit, resizeWorkoutImage } from '../../controllers/workoutImage.js';

router.post('/create', Upload.single('workoutImage'), async (req, res) => {
    try{
        const { nameWorkout, descriptionWorkout, idExercises, predefined } = req.body;

        const searchUser = await User.findById(req.user.id);
        if(!searchUser) return res.status(404).json({ msg: 'User not found.' });

        if (!nameWorkout || !descriptionWorkout || !idExercises) {
            return res.status(400).json({ msg: "Missing required fields!" });
        }

        let parsedExercises;
        parsedExercises = JSON.parse(idExercises);
        const createWorkout = new Workout({
            nameWorkout: nameWorkout,
            descriptionWorkout: descriptionWorkout,
            idUserWorkout: req.user.id,
            exercises: parsedExercises,
            predefined: predefined
        });

        const image = await workoutImageCreate(createWorkout._id, req.file);
        createWorkout.idWorkoutImage = image._id;
        await createWorkout.save();

        const countsExercises = await Workout.countDocuments({idUserWorkout: req.user.id})
        searchUser.workoutsCreated = countsExercises;
        await searchUser.save();

        return res.status(201).json({msg: 'Workout created and user update successfully!'})
    }catch(e){
        return res.status(500).json({msg: 'An error occurred while updating the user: '+e});
    };
});

router.post('/edit/:id', Upload.single('workoutImage'), async (req, res) => {
try{
    const workoutId = req.params.id;
    const { nameWorkout, descriptionWorkout, idExercises } = req.body;

    const searchUser = await User.findById(req.user.id);
    if(!searchUser) return res.json(404).json({msg: 'User not found!'});

    const searchWorkout = await Workout.findOne({_id: workoutId, idUserWorkout: req.user.id});
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
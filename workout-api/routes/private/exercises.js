import express from 'express';
import Exercise from '../../models/exercise.js';
import User from '../../models/user.js';
import Upload from '../../config/multer.js';
import { exerciseImageCreate, exerciseImageEdit, resizeExerciseImage } from '../../controllers/exerciseImage.js';
const router = express.Router();

router.post('/create', Upload.single('exerciseImage'), async (req, res) => {
try{
    const { nameExercise, descriptionExercise, reps, duration, load, sets, predefined } = req.body;

    const searchUser = await User.findById(req.user.id);
    if(!searchUser) return res.status(404).json({ msg: 'User not found!' });

    const exists = await Exercise.findOne({idExerciseCreator: req.user.id, nameExercise: nameExercise});
    if(exists){
        return res.status(400).json({msg: 'You cannot use the same exercise names!'})
    }
    if(!nameExercise || !reps || !sets){
        return res.status(400).json({msg: 'It is necessary to fill in the name, repetitions and sets fields!'})
    };


    //Criando os exercícios
    const createExercise = new Exercise({
        nameExercise: nameExercise,
        descriptionExercise: descriptionExercise,
        reps: reps,
        duration: duration,
        load: load,
        sets: sets,
        idExerciseCreator: req.user.id,
        predefined: predefined
    });
    const image = await exerciseImageCreate(createExercise._id, req.file);
    createExercise.idExerciseImage = image._id;
    await createExercise.save();

    const countsExercises = await Exercise.countDocuments({idExerciseCreator: req.user.id})
    searchUser.exercisesCreated = countsExercises;
    //Salve o usuário que criou o exercício
    await searchUser.save();
    return res.status(201).json({msg: 'Exercise created and user update!'})
    } catch(e) {
        res.status(400).json({msg: 'Error in creating exercise: '+e})
    }
});

router.post('/edit/:id', Upload.single('exerciseImage'), async (req, res) => {
try{
    const exerciseId = req.params.id;
    const { nameExercise, descriptionExercise, reps, duration, load, sets, predefined } = req.body;

    const verifyExercise = await Exercise.findOne({ _id: exerciseId, idExerciseCreator: req.user.id });
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
}catch(e){
    res.status(400).json({msg: 'Error in editing exercise: '+e})
}
});

router.post('/collectExercises', async (req, res) => {
    try{
        const searchUser = await User.findById(req.user.id);
        const searchExercises = await Exercise.find({idExerciseCreator: req.user.id});

        if(!searchUser) return res.status(404).json({ msg: 'User not found!' });

        const exerciciosDoUsuario = searchExercises.filter(ex => 
            searchUser._id.toString() === ex.idExerciseCreator.toString()
        );

        if (exerciciosDoUsuario.length === 0) {
            return res.status(404).json({ msg: 'This user has not created any exercises.' });
        };

        res.json(exerciciosDoUsuario.map(exercise => ({
        idExercise: exercise._id,
        nameExercise: exercise.nameExercise,
        descriptionExercise: exercise.descriptionExercise,
        reps: exercise.reps,
        duration: exercise.duration,
        load: exercise.load,
        sets: exercise.sets,
        predefined: exercise.predefined,
        date: exercise.date,
        nameCreaterExercise: searchUser.username
        })));   
    }catch(e){
        return res.status(500).json({ msg: 'An error occurred: ' + e });
    }
});

export default router;
import WorkoutImage from '../models/workoutImage.js';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function resizeWorkoutImage(filePath) {
  const outputFilePath = path.join(
    path.dirname(filePath),
    'new-' + path.basename(filePath)
  );

  await sharp(filePath)
    .resize(500, 500, {
      fit: sharp.fit.cover, // Corta e preenche para garantir o tamanho exato
      position: sharp.strategy.entropy // centraliza na área com mais detalhes
    })
    .toFile(outputFilePath);

  // Apaga o arquivo original depois que redimensionar (opcional)
  fs.unlinkSync(filePath);

  return outputFilePath;
}

async function workoutImageCreate( workoutId, file ){
    try {
      const searchWorkoutImage = await WorkoutImage.findOne({ workoutId });
      const imagePath = file ? file.path : 'uploads-workouts/default-workout.png';
      
      if (searchWorkoutImage) {
        // Apaga a imagem anterior do DISCO (se não for a padrão)
        if (searchWorkoutImage.src !== 'uploads-workouts/default-workout.png') {
          fs.unlink(searchUserImage.src, (err) => {
            if (err) console.error('Error deleting after image:', err);
          });
        }
      }

      const image = new WorkoutImage({
        workoutId,
        src: imagePath
      });
      await image.save();
      return image;
    } catch (e) {
      console.error('Error saving image: ',e)
    }
};

async function workoutImageEdit(workoutId, file) {
  try {
    const searchWorkoutImage = await WorkoutImage.findOne({ workoutId });
    const imagePath = file ? file.path : 'uploads-workouts/default-workout.png';

    if (searchWorkoutImage.src !== 'uploads-workouts/default-workout.png') {
      const fullPath = path.resolve(searchWorkoutImage.src);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error('Erro ao apagar imagem anterior:', err);
        } else {
          console.log('Imagem antiga apagada com sucesso!');
        }
      });

      await WorkoutImage.deleteOne({ workoutId });
    }

    const newImage = new WorkoutImage({
      workoutId,
      src: imagePath
    });
    await newImage.save();
    return newImage;
  } catch (e) {
    console.error('Erro ao atualizar imagem:', e);
  }
}

export { workoutImageCreate, workoutImageEdit, resizeWorkoutImage };
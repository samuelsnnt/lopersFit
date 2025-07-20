import ExerciseImage from '../models/exerciseImage.js';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function resizeExerciseImage(filePath) { // Função para alterar o tamanho 
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

async function exerciseImageCreate( exerciseId, file ){
    try {
      const searchExerciseImage = await ExerciseImage.findOne({ exerciseId });
      const imagePath = file ? file.path : 'uploads-exercises/default-exercise.png';
      
      if (searchExerciseImage) {
        // Apaga a imagem anterior do DISCO (se não for a padrão)
        if (searchExerciseImage.src !== 'uploads-exercises/default-exercise.png') {
          fs.unlink(searchExerciseImage.src, (err) => {
            if (err) console.error('Error deleting after image:', err);
          });
        }
      }

      const image = new ExerciseImage({
        exerciseId,
        src: imagePath
      });
      await image.save();
      return image;
    } catch (e) {
      console.error('Error saving image: ',e)
    }
};

async function exerciseImageEdit(exerciseId, file) {
  try {
    const searchExerciseImage = await ExerciseImage.findOne({ exerciseId });
    const imagePath = file ? file.path : 'uploads-exercises/default-exercise.png';

    if (searchExerciseImage.src !== 'uploads-exercises/default-exercise.png') {
      const fullPath = path.resolve(searchExerciseImage.src);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error('Erro ao apagar imagem anterior:', err);
        } else {
          console.log('Imagem antiga apagada com sucesso!');
        }
      });

      // Remoção SEM callback — use await
      await ExerciseImage.deleteOne({ exerciseId });
    }

    // Cria o novo documento normalmente
    const newImage = new ExerciseImage({
      exerciseId,
      src: imagePath
    });
    await newImage.save();
    return newImage;
  } catch (e) {
    console.error('Erro ao atualizar imagem:', e);
  }
}

export { exerciseImageCreate, exerciseImageEdit, resizeExerciseImage };
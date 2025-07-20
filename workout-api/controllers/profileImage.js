import profileImage from '../models/profileImage.js';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function resizeProfileImage(filePath) {
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

async function profileImageCreateOnRegister( reqUser, file ){
    try {
      const searchUserImage = await profileImage.findOne({ userId: reqUser });
      
      if (searchUserImage) {
        // Apaga a imagem anterior do DISCO (se não for a padrão)
        if (searchUserImage.src !== 'uploads-users/default-profile.webp') {
          fs.unlink(searchUserImage.src, (err) => {
            if (err) console.error('Error deleting after image:', err);
          });
        }
      }
      const image = new profileImage({
        userId: reqUser,
        src: 'uploads-users/default-profile.png'
      });
      await image.save();
      return image;
    } catch (e) {
      console.error('Error saving image: ',e)
    }
};
async function profileImageCreateOnEdit( reqUser, file ){
  try {
    const imagePath = file ? file.path : 'uploads-users/default-profile.webp';

    const searchUserImage = await profileImage.findOne({ userId: reqUser });
    
    if (searchUserImage) {
      // Apaga a imagem anterior do DISCO (se não for a padrão)
      if (searchUserImage.src !== 'uploads-users/default-profile.png') {
        fs.unlink(searchUserImage.src, (err) => {
          if (err) console.error('Error deleting after image:', err);
        });
      }

      // Apaga o registro do MongoDB
      await profileImage.deleteOne({ userId: reqUser });
    }

    const image = new profileImage({
      userId: reqUser,
      src: imagePath 
    });
    await image.save();
    return image;
  } catch (e) {
    return console.error('Error saving image: ',e)
  }
}

export { resizeProfileImage, profileImageCreateOnRegister ,profileImageCreateOnEdit }
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../../models/user.js'; // Importa a collection usuários para criar, ver, e fazer validações.
import Upload from '../../config/multer.js'
import { profileImageCreateOnEdit, resizeProfileImage } from '../../controllers/profileImage.js';
const router = express.Router(); // Cria um novo router para o express.

//Front-end: Coletar dados
router.post('/collectData', async (req, res) => {
  try {
    const usuario = await User.findById(req.user.id)

    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuário not found!' })
    }

    res.json({
      success: true,
      data: {
        username: usuario.username,
        email: usuario.email,
        admin: usuario.admin,
        exercises: usuario.exercisesCreated,
        workouts: usuario.workoutsCreated || [],
        date: usuario.date
      }
    })
  } catch (error) {
    console.error('Error collecting data:', error)
    res.status(500).json({ success: false, message: 'Error in server.' })
  }
})

// EDIÇÃO DE USUÁRIO
router.post('/edit', Upload.single('profileImage'), async (req, res) => {
    try{
        const {username, email, password, newPassword, newPasswordConfirm} = req.body;
        
        const usuario = await User.findById(req.user.id);
        if(!usuario){
            return res.status(404).json({msg: "User not found!"});
        };

        const emailExistente = await User.findOne({ email: email });
        if (emailExistente && emailExistente._id.toString() !== usuario._id.toString()) {
            return res.status(400).json({msg: "This email is already in use!"});
        };

        if(password || newPassword || newPasswordConfirm){
            if(newPassword !== newPasswordConfirm){
                return res.status(401).json({msg:'Password must match!'})
            };
            if(newPassword.length < 7 || newPasswordConfirm.length < 7){
                return res.status(401).json({msg:'Password must be at least 8 characters long'});
            };
            if(password === newPassword){
                return res.status(401).json({msg:'The old password cannot be the same as the new one!'});
            };

            const salt = await bcrypt.genSalt(10);
            const newPasswordHash = await bcrypt.hash(newPassword, salt);
            const checkPassword = await bcrypt.compare(password, usuario.password);
            if (!checkPassword) {
                return res.status(401).json({ msg: "Invalid original password!" });
            };
            usuario.password = newPasswordHash;
        }
        if(!username){
          usuario.username = usuario.username;
        }else{
          usuario.username = username;
        }
        if(!email){
          usuario.email = usuario.email;
        }else{
          usuario.email = email;
        }

        try {
          if (req.file) {
            const resizedImagePath = await resizeProfileImage(req.file.path);
            req.file.path = resizedImagePath;
          }
          await profileImageCreateOnEdit(req.user.id, req.file);
          await usuario.save();
          return res.status(201).json({ msg: "Update completed successfully!" });
        } catch (e) {
          return res.status(500).json({ msg: 'An error occurred: ' + e });
        }
    }catch(e){
        return res.status(500).json({msg: 'An error occurred while updating the user: '+e});
    }
});



export default router;
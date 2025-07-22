import express from 'express';
import User from '../../models/user.js'; // Importando o modelo pronto da collection "usuarios" para ser usado.
import ProfileImage from '../../models/profileImage.js';
import Upload from '../../config/multer.js';
import bcrypt from 'bcryptjs'; // Gera um hash(sua senha original codificada) e para o usuário acessar, ele precisa acertar qual a senha que gera esse hash que está armazenado no banco de dados.
import jwt from 'jsonwebtoken'; // ferramenta para criar e validar tokens de segurança, garantindo que o usuário está autenticado e que os dados da requisição não foram forjados.
import { profileImageCreateOnRegister } from '../../controllers/profileImage.js';
const router = express.Router(); // Organiza minha rotas em grupos, que no caso são arquivos, como este.

// REGISTRO DE USUÁRIO
router.post('/register', Upload.single('uploads-users'), async(req, res) => {
    const {username, email, password, confirmPassword} = req.body;

    if(!username){
        return res.status(422).json({success: false, msg:"Username was not provided!"});
    };
    if(!email){
        return res.status(422).json({success: false, msg:"Email was not provided!"});
    };
    if(!password){
        return res.status(422).json({success: false, msg:"Password was not provided!"});
    };
    if(password.length <= 7){
        return res.status(422).json({success: false, msg:"Password must be at least 8 characters!"});
    };
    if(!confirmPassword){
        return res.status(422).json({success: false, msg:"Password confirmation was not provided!"});
    };
    if(confirmPassword !== password){
        return res.status(401).json({success: false, msg:"Passwords do not match!"});
    };

    const userEmail = await User.findOne({email:email});
    if(userEmail){
        return res.status(200).json({success: false, msg:"This email is already in use!"});
    };

     const salt = await bcrypt.genSalt(12);
     const passwordHash = await bcrypt.hash(password, salt);


     const createUser = new User({
        username: username,
        email: email,
        password: passwordHash,
     });

     try {
        const image = await profileImageCreateOnRegister(createUser._id, req.file)
        createUser.profileImageId = image._id;
        await createUser.save();
        res.status(201).json({success: true, msg:"User successfully created!"});
     } catch {
        res.status(500).json({success: false, msg: "There was a server error."})
     }
});

// LOGIN DE USUÁRIO
router.post('/login', async (req, res) => {
    const token = req.cookies.AuthToken;
    const secret = process.env.SECRET;

    if (token) {
        try {
            const decoded = jwt.verify(token, secret);
            const userActual = await User.findById(decoded.id);
            if(!userActual){
                res.clearCookie('AuthToken');
                return res.status(404).json({ success: false, msg: 'User not found!'})
            }
            return res.status(200).json({ success: true, msg: "You are already logged in!" });
        } catch (e) {
            res.clearCookie('AuthToken');
            return res.status(401).json({ success: false, msg: "Invalid token!" });
        }
    }

    const { username, email, password } = req.body || {};

    if (!username) {
        return res.status(422).json({ success: false, msg: "Username was not provided!" });
    }
    if (!email) {
        return res.status(422).json({ success: false, msg: "Email was not provided!" });
    }
    if (!password) {
        return res.status(422).json({ success: false, msg: "Password was not provided!" });
    }

    const userLogged = await User.findOne({ email: email });
    if (!userLogged) {
        return res.status(404).json({ success: false, msg: "Email not found!" });
    }

    const checkPassword = await bcrypt.compare(password, userLogged.password);
    if (!checkPassword) {
        return res.status(401).json({ success: false, msg: "Invalid password" });
    }

    const result = await User.find();
    if(result.length === 0){
        res.clearCookie('AuthToken');
    };

    try {
        const token = jwt.sign({ id: userLogged._id, username: userLogged.username }, secret, { expiresIn: '604800s' });
        res.cookie('AuthToken', token, {
            httpOnly: true,
            secure: process.env.SECURE,
            maxAge: 604800 * 1000
        });
        return res.status(200).json({
            success: true,
            msg: "Authentication successful",
            data: {
                user: {
                id: userLogged._id,
                username: userLogged.username,
                email: userLogged.email,
                createdAt: userLogged.date,
                admin: userLogged.admin,
                workouts: userLogged.workouts || []
                }
            }, token });
    } catch (e) {
        return res.status(500).json({ success: false, msg: `There was a server error: ${e}` });
    }
});

router.post('/logout', (req, res) => {
    const token = req.cookies.AuthToken;
    const secret = process.env.SECRET;

    if (token) {
        try {
            const decoded = jwt.verify(token, secret);
            res.clearCookie('AuthToken', {
                httpOnly: true,
                secure: process.env.SECURE
            });
            res.status(200).json({ success: true, msg:`User "${decoded.username}" successfully logged out!`})
        } catch (e) {
            return res.status(401).json({ success: false, msg: "Invalid token!" });
        }
    }else{
        return res.status(401).json({ success: false, msg: "Token not found!" });
    }
});

router.post('/delete', async (req, res) => {
    const token = req.cookies.AuthToken;
    const secret = process.env.SECRET;

    if (token) {
        try {
            const decoded = jwt.verify(token, secret);
            res.clearCookie('AuthToken', {
                httpOnly: true,
                secure: process.env.SECURE
            });
            const resultUser = await User.deleteOne({ _id: decoded.id });
            const resultImageUser = await ProfileImage.deleteOne({ userId: decoded.id });
            if (resultUser.deletedCount === 0) {
                return res.status(404).json({ success: false, msg: "User not found!" });
            }
            if (resultImageUser.deletedCount === 0) {
                return res.status(404).json({ success: false, msg: "User Image not found!" });
            }
            res.status(200).json({ success: true, msg:`User successfully deleted!` })
        } catch (e) {
            return res.status(401).json({ success: false, msg: "Invalid token!" });
        }
    }else{
        return res.status(401).json({ success: false, msg: "Token not found!" });
    }
});


export default router;


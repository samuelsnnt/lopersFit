import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const authAdmin = async function(req, res, next){
    try{
        const token = req.cookies.AuthToken;
        const secret = process.env.SECRET;
        const decoded = jwt.verify(token, secret);
        
        if(!token){
            res.status(401).json({msg: 'Token not provided'})
        }
        try{
            const usuario = await User.findById(decoded.id)
            if(usuario){
                if(usuario.admin === true){
                    next();
                }else{
                    res.status(400).json({msg: 'You are not a user administrator!'})
                }
            }else{
                res.status(404).json({msg: 'User not found!'}) // Se o token não for válido irá dar erro.
            }
        }catch(e){
            res.status(400).json({msg: 'Você não possui permissão admin!'}) // Se o token não for válido irá dar erro.
        }
    }catch(e){
        res.status(401).json(e.message)
    }
};

export default authAdmin;
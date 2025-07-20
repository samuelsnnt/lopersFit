import jwt from 'jsonwebtoken'; // ferramenta para criar e validar tokens de segurança, garantindo que o usuário está autenticado e que os dados da requisição não foram forjados.
const authMiddleware = function(req, res, next){
    const token = req.cookies.AuthToken;

    if(!token){ // se o token não existir.
        return res.status(401).json({msg: 'Access denied!'})
    }
    try{
        const secret = process.env.SECRET
        const decoded = jwt.verify(token, secret);
        req.user = decoded; // adiciona o usuário autenticado ao objeto req.
        next();
    } catch(e){
        res.status(400).json({msg: 'Token inválido, faça login novamente!'}) // Se o token não for válido irá dar erro.
    }
}

export default authMiddleware;
const LoginModel = require('../models/login.model');
const { verifyAuthToken } = require('../utils/auth-token');

const checkToken = async (req, res, next) => {

    //esta el token en la cabecera ?
    if (!req.headers.authorization) {
        return res.status(403)
            .json({
                message: 'El token es obligatorio'
            })
    }

    //es válido ??
    const token = req.headers.authorization;
    let payload;
    try {
        payload = verifyAuthToken(token);
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message: "Token incorrecto"
        })
    }

    //existe el usuario al que hace referencia el token?
    //payload tiene userId
    const userId = payload.userId;
    const user = await LoginModel.selectById(userId);
    if (!user) {
        return res.status(403)
            .json({
                message: 'El usuario no existe'
            })
    }

    req.user = user;



    next();
}
module.exports = {
    checkToken
};

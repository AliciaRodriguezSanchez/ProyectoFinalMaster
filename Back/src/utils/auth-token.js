const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET_KEY;

    if (!secret) {
        throw new Error('JWT secret no configurado');
    }

    return secret;
};

const createAuthToken = ({ userId, id, role, rol_id, name, nombre, surname, apellidos, username, nombre_usuario }) => {
    return jwt.sign({
        userId: userId ?? id,
        role: role ?? rol_id,
        name: name ?? nombre,
        surname: surname ?? apellidos,
        username: username ?? nombre_usuario
    }, getJwtSecret());
};

const verifyAuthToken = (token) => {
    return jwt.verify(token, getJwtSecret());
};

module.exports = {
    createAuthToken,
    verifyAuthToken
};

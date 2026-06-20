const db = require('../config/db');

const selectById = async ( userId ) => {
    const [result] = await db.query(
        'SELECT * FROM perfiles WHERE id = ?',
        [userId]
    );
    if(result.length == 0) return null;
    return result[0];
}

const selectByEmail = async ( email ) => {
    const [result] = await db.query(
        'SELECT id, nombre, nombre_usuario, apellidos, email, contraseña AS password, rol_id FROM perfiles WHERE email = ?',
        [email]
    );
    if(result.length == 0) return null;
    return result[0];
}

const insert = async ({ name, username, surname, email, password , rol}) => {
    const [result] = await db.query(
        'INSERT INTO perfiles (nombre, nombre_usuario,apellidos, email, contraseña, rol_id) VALUES (?, ?, ?, ?, ?, ?)',
        [name, username, surname, email, password, rol]
    );

    return result;
}


module.exports = {
    selectById,
    selectByEmail,
    insert
};

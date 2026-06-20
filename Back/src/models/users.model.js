const db = require('../config/db');

const insert = async ({ name, username, lastname, email, password}) => {
    const [result] = await db.query(
        'INSERT INTO perfiles (nombre, apellidos, nombre_usuario, email, contraseña, rol_id) VALUES (?, ?, ?, ?, ?, ?)',
        [name, lastname, username, email, password, 1]
    );

    return result;
}

const selectByEmail = async(email) =>{
    const [result] = await db.query(
        'SELECT * FROM perfiles WHERE email = ?',
        [email]
    )

    return result[0] || null;
}

const selectByUsername = async(username) =>{
    const [result] = await db.query(
        'SELECT * FROM perfiles WHERE nombre_usuario = ?',
        [username]
    )

    return result[0] || null;
}

module.exports = {
    insert,
    selectByEmail,
    selectByUsername
}
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

const selectByEmailAndUsername = async(email, username) =>{
    const [result] = await db.query(
        'SELECT * FROM perfiles WHERE email = ? AND nombre_usuario = ?',
        [email, username]
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

const updatePasswordByEmail = async (email, password) => {
    const [result] = await db.query(
        'UPDATE perfiles SET contraseña = ? WHERE email = ?',
        [password, email]
    );

    return result;
}

const updatePasswordByEmailAndUsername = async (email, username, password) => {
    const [result] = await db.query(
        'UPDATE perfiles SET contraseña = ? WHERE email = ? AND nombre_usuario = ?',
        [password, email, username]
    );

    return result;
}

const numberUsers = async () => {
    const [result] = await db.query(`
        SELECT COUNT(*) FROM perfiles;
        `);
    return result;
}

const getAllUsers = async () => {
    const [result] = await db.query(`
        SELECT p.nombre, p.apellidos, p.email, r.nombre_rol, p.estado_cuenta
        FROM perfiles AS p 
        JOIN roles AS r ON p.rol_id==r.id
        `);
    return result;
}

module.exports = {
    insert,
    selectByEmail,
    selectByEmailAndUsername,
    selectByUsername,
    updatePasswordByEmail,
    updatePasswordByEmailAndUsername,
    numberUsers,
    getAllUsers
}

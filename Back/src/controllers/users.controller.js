const bcrypt = require('bcryptjs');
const userModel = require('../models/users.model')
const { createAuthToken } = require('../utils/auth-token');


const register = async (req, res) => {
    try {
    
        const { name, lastname, username, email, password, repetPassword } = req.body;

        if(!name || !lastname || !username || !email || !password || !repetPassword){
            return res.status(400).json({ message: 'Todos los campos son obligatorios' })
        }

        if(password !== repetPassword){
            return res.status(400).json({ message: 'Las contraseñas no coinciden' });
        }

        const user = await userModel.selectByEmail(email)

        if(user){
            return res.status(409).json({
                message: 'Ese email ya está registrado'
            })
        }

        const usernameExist = await userModel.selectByUsername(username)

        if(usernameExist){
            return res.status(409).json({
                message: 'Ese nombre de usuario ya está registrado'
            })
        }

        const hashedPassword = bcrypt.hashSync(password, 8);
        const formattedName = capitalizar(name);
        const formattedLastname = capitalizar(lastname);


        const newUser = await userModel.insert({
            name: formattedName,
            lastname: formattedLastname,
            username,
            email,
            password: hashedPassword
        });

        const token = createAuthToken({
            userId: newUser.insertId,
            role: 1,
            name: formattedName,
            surname: formattedLastname,
            username,
        });


        res.status(201).json({
            message: 'Usuario registrado con éxito',
            token
        });

    }catch (error) {
            res.status(500).json({ 
                message: error.message });
        }
} 

const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, repeatPassword } = req.body;

        if (!email || !newPassword || !repeatPassword) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        if (newPassword !== repeatPassword) {
            return res.status(400).json({ message: 'Las contraseñas no coinciden' });
        }

        const user = await userModel.selectByEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'No existe ningún usuario con ese email' });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 8);
        await userModel.updatePasswordByEmail(email, hashedPassword);

        res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


////////////////funciones auxiliares

const capitalizar = (texto) => {
    return texto
        .toLowerCase()
        .split(' ')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ');
}

module.exports = {
    register,
    resetPassword
}

const LoginModel = require('../models/login.model');
const bcrypt = require("bcryptjs");
const { createAuthToken } = require('../utils/auth-token');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña son obligatorios" });
        }

        const user = await LoginModel.selectByEmail(email);
        if (!user?.password) {
            return res.status(401).json({ message: "Error email y/o contraseña" });
        }

        const isPasswordOk = bcrypt.compareSync(password, user.password);
        if (!isPasswordOk) {
            return res.status(401).json({ message: "Error email y/o contraseña" });
        }


        res.json({
            message: "Login correcto!",
            token: createAuthToken({
                userId: user.id,
                role: user.rol_id,
                name: user.nombre,
                surname: user.apellidos,
                username: user.nombre_usuario
            })
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    login
};

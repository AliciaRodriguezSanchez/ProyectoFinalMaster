const LoginModel = require('../models/login.model');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        req.body.password = bcrypt.hashSync(req.body.password, 8);
        const result = await LoginModel.insert(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

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
            token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KET)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    register,
    login
};

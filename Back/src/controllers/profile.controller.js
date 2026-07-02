const bcrypt = require('bcryptjs');
const Profile = require('../models/profile.model');
const { createAuthToken } = require('../utils/auth-token');
const { ERROR_MESSAGE_TEXT } = require('../constants/error-message.text');

const getMe = async (req, res) => {
    try {
        console.log("DEBUG: Buscando perfil para el usuario ID:", req.user.id);
        
        const profile = await getProfileResponse(req.user.id);

        if (!profile) {
            console.log("DEBUG: Perfil no encontrado en BD para ID:", req.user.id);
            return res.status(404).json({ message: 'Perfil no encontrado' });
        }

        res.json(profile);
    } catch (error) {
        console.error('Error al obtener perfil:', error.message);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// FUNCIÓN PARA PERFIL PÚBLICO (No depende de req.user)
const getProfileById = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await getProfileResponse(id);

        if (!profile) {
            return res.status(404).json({ message: ERROR_MESSAGE_TEXT.profile.notFound });
        }

        res.json(profile);
    } catch (error) {
        console.error('Error al obtener perfil público:', error.message);
        res.status(500).json({ message: ERROR_MESSAGE_TEXT.profile.loadError });
    }
};

const updateMe = async (req, res) => {
    try {
        const { name, lastname, username, email, photoUrl } = req.body;

        if (!name || !lastname || !username || !email) {
            return res.status(400).json({ message: ERROR_MESSAGE_TEXT.common.requiredFields });
        }

        const emailExists = await Profile.selectByEmailOtherUser(email, req.user.id);

        if (emailExists) {
            return res.status(409).json({ message: ERROR_MESSAGE_TEXT.user.duplicatedEmail });
        }

        const usernameExists = await Profile.selectByUsernameOtherUser(username, req.user.id);

        if (usernameExists) {
            return res.status(409).json({ message: ERROR_MESSAGE_TEXT.user.duplicatedUsername });
        }

        const formattedName = capitalizar(name);
        const formattedLastname = capitalizar(lastname);

        await Profile.updateProfile(req.user.id, {
            name: formattedName,
            lastname: formattedLastname,
            username,
            email,
            photoUrl
        });

        const profile = await getProfileResponse(req.user.id);

        if (!profile) {
            return res.status(404).json({ message: ERROR_MESSAGE_TEXT.profile.notFound });
        }

        const token = createAuthToken({
            userId: profile.id,
            role: profile.roleId,
            name: profile.name,
            surname: profile.lastname,
            username: profile.username
        });

        res.json({
            message: 'Perfil actualizado correctamente',
            profile,
            token
        });
    } catch (error) {
        console.error('Error al actualizar perfil:', error.message);
        res.status(500).json({ message: ERROR_MESSAGE_TEXT.profile.updateError });
    }
};

const checkPassword = async (req, res) => {
    try {
        const { currentPassword } = req.body;

        if (!currentPassword) {
            return res.status(400).json({ message: ERROR_MESSAGE_TEXT.profile.currentPasswordRequired });
        }

        const isPasswordOk = await isCurrentPasswordOk(req.user.id, currentPassword);

        if (!isPasswordOk) {
            return res.status(400).json({ message: ERROR_MESSAGE_TEXT.profile.invalidCurrentPassword });
        }

        res.json({ message: 'Contraseña actual correcta' });
    } catch (error) {
        console.error('Error al comprobar contraseña:', error.message);
        res.status(500).json({ message: ERROR_MESSAGE_TEXT.profile.checkPasswordError });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, repeatPassword } = req.body;

        if (!currentPassword || !newPassword || !repeatPassword) {
            return res.status(400).json({ message: ERROR_MESSAGE_TEXT.common.requiredFields });
        }

        if (newPassword !== repeatPassword) {
            return res.status(400).json({ message: ERROR_MESSAGE_TEXT.user.passwordMismatch });
        }

        const isPasswordOk = await isCurrentPasswordOk(req.user.id, currentPassword);

        if (!isPasswordOk) {
            return res.status(400).json({ message: ERROR_MESSAGE_TEXT.profile.invalidCurrentPassword });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 8);
        await Profile.updatePassword(req.user.id, hashedPassword);

        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error('Error al cambiar contraseña:', error.message);
        res.status(500).json({ message: ERROR_MESSAGE_TEXT.profile.changePasswordError });
    }
};

const getProfileResponse = async (id) => {
    const profile = await Profile.selectProfileById(id);

    if (!profile) {
        return null;
    }

    const ratingSummary = await Profile.selectRatingSummary(id);
    const stats = await Profile.selectProfileStats(id);
    const ratingLines = await Profile.selectRatingLines(id);
    const reviews = await Profile.selectReviews(id);

    const reviewCount = Number(ratingSummary.reviewCount || 0);
    const averageRating = reviewCount > 0
        ? Number(ratingSummary.averageRating || 0)
        : Number(profile.valoracion_media || 0);

    return {
        id: profile.id,
        name: profile.nombre,
        lastname: profile.apellidos,
        username: profile.nombre_usuario,
        email: profile.email,
        registerDate: profile.fecha_registro,
        averageRating,
        reviewCount,
        photoUrl: profile.foto_perfil,
        status: profile.estado_cuenta,
        roleId: profile.rol_id,
        ratingLines: getRatingLines(ratingLines),
        reviews,
        stats: {
            totalArticles: Number(stats.totalArticles || 0),
            publishedArticles: Number(stats.publishedArticles || 0),
            soldArticles: Number(stats.soldArticles || 0),
            favoriteArticles: Number(stats.favoriteArticles || 0)
        }
    };
};

const getRatingLines = (ratingLines) => {
    return [5, 4, 3, 2, 1].map((stars) => {
        const line = ratingLines.find((ratingLine) => Number(ratingLine.stars) === stars);
        return {
            stars,
            count: Number(line?.count || 0)
        };
    });
};

const isCurrentPasswordOk = async (id, currentPassword) => {
    const userPassword = await Profile.selectPasswordById(id);
    if (!userPassword?.password) return false;
    try {
        return bcrypt.compareSync(currentPassword, userPassword.password);
    } catch {
        return false;
    }
};

const capitalizar = (texto) => {
    return texto
        .toLowerCase()
        .split(' ')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ');
};

module.exports = {
    getMe,
    getProfileById,
    updateMe,
    checkPassword,
    changePassword
};

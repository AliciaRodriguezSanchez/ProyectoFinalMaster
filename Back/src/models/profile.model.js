const db = require('../config/db');

const selectProfileById = async (id) => {
    const [result] = await db.query(
        `SELECT id, nombre, apellidos, nombre_usuario, email, fecha_registro,
            valoracion_media, foto_perfil, estado_cuenta, rol_id
        FROM perfiles
        WHERE id = ?`,
        [id]
    );

    return result[0] || null;
};

const selectRatingSummary = async (id) => {
    const [result] = await db.query(
        `SELECT
            COUNT(id) AS reviewCount,
            COALESCE(AVG(CAST(puntuacion AS UNSIGNED)), 0) AS averageRating
        FROM valoraciones
        WHERE receptor_id = ?`,
        [id]
    );

    return result[0];
};

const selectProfileStats = async (id) => {
    const [result] = await db.query(
        `SELECT
            (SELECT COUNT(*) FROM articulos WHERE perfil_id = ?) AS totalArticles,
            (SELECT COUNT(*) FROM articulos WHERE perfil_id = ? AND estado_revision = 'Publicado') AS publishedArticles,
            (SELECT COUNT(*) FROM articulos WHERE perfil_id = ? AND estado_venta = 'Vendido') AS soldArticles,
            (SELECT COUNT(*) FROM favoritos WHERE perfil_id = ?) AS favoriteArticles`,
        [id, id, id, id]
    );

    return result[0];
};

const selectRatingLines = async (id) => {
    const [result] = await db.query(
        `SELECT CAST(puntuacion AS UNSIGNED) AS stars, COUNT(id) AS count
        FROM valoraciones
        WHERE receptor_id = ?
        GROUP BY puntuacion`,
        [id]
    );

    return result;
};

const selectReviews = async (id) => {
    const [result] = await db.query(
        `SELECT v.id,
            CAST(v.puntuacion AS UNSIGNED) AS rating,
            v.comentario,
            v.fecha_valoracion,
            p.nombre AS authorName,
            p.apellidos AS authorLastName,
            p.nombre_usuario AS authorUsername,
            a.titulo AS articleTitle
        FROM valoraciones v
        INNER JOIN perfiles p ON v.emisor_id = p.id
        LEFT JOIN articulos a ON v.articulo_id = a.id
        WHERE v.receptor_id = ?
        ORDER BY v.fecha_valoracion DESC`,
        [id]
    );

    return result;
};

const selectByEmailOtherUser = async (email, id) => {
    const [result] = await db.query(
        'SELECT id FROM perfiles WHERE email = ? AND id <> ?',
        [email, id]
    );

    return result[0] || null;
};

const selectByUsernameOtherUser = async (username, id) => {
    const [result] = await db.query(
        'SELECT id FROM perfiles WHERE nombre_usuario = ? AND id <> ?',
        [username, id]
    );

    return result[0] || null;
};

const updateProfile = async (id, profileData) => {
    const { name, lastname, username, email, photoUrl } = profileData;

    const [result] = await db.query(
        `UPDATE perfiles
        SET nombre = ?, apellidos = ?, nombre_usuario = ?, email = ?, foto_perfil = ?
        WHERE id = ?`,
        [name, lastname, username, email, photoUrl || null, id]
    );

    return result;
};

const selectPasswordById = async (id) => {
    const [result] = await db.query(
        'SELECT contraseña AS password FROM perfiles WHERE id = ?',
        [id]
    );

    return result[0] || null;
};

const updatePassword = async (id, password) => {
    const [result] = await db.query(
        'UPDATE perfiles SET contraseña = ? WHERE id = ?',
        [password, id]
    );

    return result;
};

module.exports = {
    selectProfileById,
    selectRatingSummary,
    selectProfileStats,
    selectRatingLines,
    selectReviews,
    selectByEmailOtherUser,
    selectByUsernameOtherUser,
    updateProfile,
    selectPasswordById,
    updatePassword
};

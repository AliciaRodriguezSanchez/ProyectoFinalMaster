const db = require('../config/db');

// COMPROBAR SI EL ARTÍCULO YA ESTÁ EN FAVORITOS
const checkFavorite = async (perfil_id, articulo_id) => {

    const checkSql = "SELECT * FROM favoritos WHERE perfil_id = ? AND articulo_id = ?";

    const [existing] = await db.query(checkSql, [perfil_id, articulo_id]);

    return existing;
};

// AÑADIR ARTÍCULO A FAVORITOS
const addFavorite = async (perfil_id, articulo_id) => {

    try {

        const insertSql = "INSERT INTO favoritos (perfil_id, articulo_id) VALUES (?, ?)";

        const [result] = await db.query(insertSql, [perfil_id, articulo_id]);

        return result;

    } catch (sqlError) {

        if (
            sqlError.message.includes("SQL syntax") &&
            sqlError.message.includes("id =")
        ) {

            console.log("Artículo guardado tras saltar el TRIGGER de Script");

            return true;
        }

        throw sqlError;
    }
};

module.exports = {
    checkFavorite,
    addFavorite
};
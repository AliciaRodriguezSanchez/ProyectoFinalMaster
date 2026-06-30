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

// OBTENER LOS FAVORITOS DE UN USUARIO
const getFavoritesByProfileId = async (perfil_id) => {
  const [rows] = await db.query(
    `SELECT
      a.id,
      a.titulo,
      a.descripcion,
      a.foto,
      a.precio,
      a.estado_articulo,
      a.estado_revision,
      a.estado_venta,
      a.fecha_publicacion,
      a.perfil_id,
      a.categoria_id,
      c.nombre AS categoria_nombre
    FROM favoritos f
    INNER JOIN articulos a
      ON f.articulo_id = a.id
    LEFT JOIN categorias c
      ON a.categoria_id = c.id
    WHERE f.perfil_id = ?
    ORDER BY a.fecha_publicacion DESC`,
    [perfil_id]
  );

  return rows;
};

module.exports = {
  checkFavorite,
  addFavorite,
  getFavoritesByProfileId
};
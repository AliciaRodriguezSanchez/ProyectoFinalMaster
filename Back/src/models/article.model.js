const db = require('../config/db');

// OBTENER TODOS LOS ARTÍCULOS CON FILTROS
const getAllArticles = async (filters) => {

    // QUERY SÓLO PUBLICADOS Y DISPONIBLES
    let sql = `
    SELECT id, titulo, descripcion, foto, precio, estado_revision,
           estado_articulo, estado_venta, fecha_publicacion, perfil_id, categoria_id
    FROM articulos
    WHERE estado_revision = 'Publicado' AND estado_venta = 'Disponible'
    `;

    const queryParams = [];

    const { title, categoryId, status, minPrice, maxPrice } = filters;

    // FILTRO DE BÚSQUEDA POR PALABRA CLAVE
    if (title) {
        sql += " AND titulo LIKE ?";
        queryParams.push(`%${title}%`);
    }

    if (categoryId) {
        sql += " AND categoria_id = ?";
        queryParams.push(categoryId);
    }

    if (status) {
        sql += " AND estado_articulo = ?";
        queryParams.push(status);
    }

    if (minPrice) {
        sql += " AND precio >= ?";
        queryParams.push(minPrice);
    }

    if (maxPrice) {
        sql += " AND precio <= ?";
        queryParams.push(maxPrice);
    }

    // ORDENAR POR FECHA DE PUBLICACIÓN DESCENDENTE
    sql += " ORDER BY fecha_publicacion DESC";

    const [rows] = await db.query(sql, queryParams);

    return rows;
};

// DETALLE ARTÍCULO POR ID
const getArticleById = async (id) => {

    const sql = `
        SELECT a.*,
         c.nombre AS categoria_nombre,
         p.nombre AS vendedor_nombre,
         p.apellidos AS vendedor_apellidos,
         p.nombre_usuario AS vendedor_nickname

        FROM articulos a
        LEFT JOIN categorias c ON a.categoria_id = c.id
        LEFT JOIN perfiles p ON a.perfil_id = p.id
        WHERE a.id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    return rows;
};

// CREAR NUEVO ARTÍCULO
const createArticle = async (articleData) => {

    const {
        titulo,
        descripcion,
        foto,
        precio,
        estado_revision,
        estado_articulo,
        perfil_id,
        categoria_id
    } = articleData;

    // CONSULTA SQL_ PASAMOS estado_revision COMO PARÁMETRO
    const sql = `
    INSERT INTO articulos
    (titulo, descripcion, foto, precio, estado_revision, estado_articulo, estado_venta, fecha_publicacion, perfil_id, categoria_id)
    VALUES (?, ?, ?, ?, ?, ?, 'Disponible', NOW(), ?, ?)
    `;

    const [result] = await db.query(sql, [
        titulo,
        descripcion,
        foto,
        precio,
        estado_revision,
        estado_articulo,
        perfil_id,
        categoria_id
    ]);

    return result;
};

// COMPRAR ARTÍCULO
const buyArticle = async (id) => {

    const sql = `
    UPDATE articulos
    SET estado_venta = 'Vendido'
    WHERE id = ? AND estado_venta = 'Disponible'
    `;

    const [result] = await db.query(sql, [id]);

    return result;
};

// RESERVAR ARTÍCULO
const reserveArticle = async (id) => {

    const sql = `
    UPDATE articulos
    SET estado_venta = 'Reservado'
    WHERE id = ? AND estado_venta = 'Disponible'
    `;

    const [result] = await db.query(sql, [id]);

    return result;
};

const getLastArticles = async () => {
    const [result] = await db.query(
        `SELECT a.*,
            c.nombre AS categoria_nombre
        FROM articulos a
        LEFT JOIN categorias c ON a.categoria_id = c.id
        WHERE a.estado_revision = 'Publicado'
            AND a.estado_venta = 'Disponible'
        ORDER BY a.fecha_publicacion DESC
        LIMIT 10`
    );

    return result;

}

const getArticlesInPromotion = async () => {
    const [result] = await db.query(
        `SELECT a.*
        FROM articulos as a
        WHERE  a.in_promotion = 1
        ORDER BY a.fecha_publicacion DESC`
    );

    return result;

}

// OBTENER TODOS LOS ARTÍCULOS DE UN USUARIO
const getArticlesByProfileId = async (profileId) => {
    const [rows] = await db.query(
        `SELECT
            a.id,
            a.titulo,
            a.descripcion,
            a.foto,
            a.precio,
            a.estado_revision,
            a.estado_articulo,
            a.estado_venta,
            a.fecha_publicacion,
            a.perfil_id,
            a.categoria_id,
            c.nombre AS categoria_nombre
         FROM articulos a
         LEFT JOIN categorias c
            ON a.categoria_id = c.id
         WHERE a.perfil_id = ?
         ORDER BY a.fecha_publicacion DESC`,
        [profileId]
    );

    return rows;
};

//PUT /aritcles/:id

const reportStateRefresh = async (id, nuevo_estado) =>{
    const [result] = await db.query(`
        UPDATE articulos 
        SET estado_revision = ? 
        WHERE id= ? 
        `, [nuevo_estado, parseInt(id)]);
    return result;
}   

const getArticlesNumber = async () => {
    const [result] = await db.query(`
        SELECT COUNT(*)
        FROM articulos
        `);
    return result;
}

const getArticlesSoldNumber = async () => {
    const [result] = await db.query(`
        SELECT COUNT(*)
        FROM articulos
        WHERE estado_venta= 'Vendido'
    `);
    return result;
}

const getArticlesReviewNumber = async () => {
    const [result] = await db.query(`
        SELECT COUNT(*)
        FROM articulos
        WHERE estado_revision = 'Pendiente_Revision'        
    `);
    return result;
}

module.exports = {
    getAllArticles,
    getArticleById,
    getLastArticles,
    getArticlesInPromotion,
    createArticle,
    buyArticle,
    reserveArticle,
    getArticlesByProfileId,
    reserveArticle,
    reportStateRefresh,
    getArticlesNumber,
    getArticlesSoldNumber,
    getArticlesReviewNumber
};
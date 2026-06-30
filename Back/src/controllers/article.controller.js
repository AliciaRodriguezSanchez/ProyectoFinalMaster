const Article = require('../models/article.model');

// GET /api/articles
const getAllArticles = async (req, res) => {

    try {

        // FILTROS DE BÚSQUEDA
        const { title, categoryId, status, minPrice, maxPrice } = req.query;

        //5. EJECUTAR CONSULTA MEDIANTE PROMESAS
        const rows = await Article.getAllArticles({
            title,
            categoryId,
            status,
            minPrice,
            maxPrice
        });

        // DEVOLVER ARRAY CON ARTÍCULOS FILTRADOS EN ANGULAR
        res.status(200).json(rows);

    } catch (error) {
        console.error('Error al recuperar artículos:', error.message);
        res.status(500).json({ message: 'Server error al recuperar artículos' });
    }
};

// GET /api/articles/:id DETALLE ARTICULO
const getArticleById = async (req, res) => {
    try {
        const { id } = req.params;

        const rows = await Article.getArticleById(id);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al encontrar artículo' });
    }
};

// POST /api/articles CREAR NUEVO ARTÍCULO
const createArticle = async (req, res) => {
    try {

        // 1. AÑADIMOS estado_revision
        const {
            titulo,
            descripcion,
            foto,
            precio,
            estado_articulo,
            estado_revision,
            perfil_id,
            categoria_id
        } = req.body;

        // VALIDACIÓN BÁSICA
        if (!titulo || !descripcion || !foto || !precio || !estado_articulo || !estado_revision || !perfil_id || !categoria_id) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // EJECUTAR INSERCIÓN CON LOS VALORES DE ANGULAR
        const result = await Article.createArticle({
            titulo,
            descripcion,
            foto,
            precio,
            estado_revision,
            estado_articulo,
            perfil_id,
            categoria_id
        });

        res.status(201).json({
            message: `¡Artículo subido con éxito como ${estado_revision}! `,
            articleId: result.insertId
        });

    } catch (error) {
        console.error('Error al subir el artículo:', error.message);
        res.status(500).json({ message: 'Server error al subir el artículo' });
    }
};

// PUT /api/articles/:id/buy COMPRAR ARTÍCULO
const buyArticle = async (req, res) => {
    try {

        //  OBTENER ID DEL ARTÍCULO
        const { id } = req.params;

        const result = await Article.buyArticle(id);

        // SI EL VALOR ES 0, SIGNIFICA QUE EL ARTÍCULO YA FUE VENDIDO O NO EXISTE
        if (result.affectedRows === 0) {
            return res.status(400).json({
                message: 'Artículo no disponible para la compra'
            });
        }

        // RESPUESTA EXITOSA. ANGULAR LO MARCA COMO VENDIDO
        res.status(200).json({
            message: '¡Artículo comprado con éxito! El producto se ha vendido.'
        });

    } catch (error) {
        console.error('Error al comprar el artículo:', error.message);
        res.status(500).json({ message: 'Server error al comprar el artículo' });
    }
};

// PUT /api/articles/:id/reserve RESERVAR ARTÍCULO
const reserveArticle = async (req, res) => {
    try {

        // OBTENER ID DEL ARTÍCULO
        const { id } = req.params;

        const result = await Article.reserveArticle(id);

        // SI EL VALOR ES 0, SIGNIFICA QUE EL ARTÍCULO YA FUE VENDIDO O NO EXISTE
        if (result.affectedRows === 0) {
            return res.status(400).json({
                message: 'Artículo no disponible para la reserva'
            });
        }

        // RESPUESTA EXITOSA. ANGULAR LO MARCA COMO RESERVADO
        res.status(200).json({
            message: '¡Artículo reservado con éxito! El producto se ha marcado como reservado.'
        });

    } catch (error) {
        console.error('Error al reservar el artículo:', error.message);
        res.status(500).json({ message: 'Server error al reservar el artículo' });
    }
};

const getLastArticles = async (req, res) => {
    try {
        const result = await Article.getLastArticles();

        res.status(200).json(result);
    }catch (error) {
        console.error('Error al obtener los artículos: ', error.message);
        res.status(500).json({ message: 'Error al obtener los artículos' });
    }
}
const getArticlesInPromotion = async (req, res) => {
    try {
        const result = await Article.getArticlesInPromotion();

        res.status(200).json(result);
    }catch (error) {
        console.error('Error al obtener los artículos: ', error.message);
        res.status(500).json({ message: 'Error al obtener los artículos' });
    }
}

// GET /api/articles/profile/:profileId
const getArticlesByProfileId = async (req, res) => {
  try {
    const { profileId } = req.params;

    if (!profileId || Number.isNaN(Number(profileId))) {
      return res.status(400).json({
        message: 'El identificador del perfil no es válido'
      });
    }

    const articles = await Article.getArticlesByProfileId(profileId);

    res.status(200).json(articles);
  } catch (error) {
    console.error(
      'Error al obtener los artículos del usuario:',
      error.message
    );

    res.status(500).json({
      message: 'Error del servidor al obtener los artículos del usuario'
    });
  }
};

module.exports = {
    getAllArticles,
    getArticleById,
    getLastArticles,
    getArticlesInPromotion,
    createArticle,
    buyArticle,
    reserveArticle,
    getArticlesByProfileId
};

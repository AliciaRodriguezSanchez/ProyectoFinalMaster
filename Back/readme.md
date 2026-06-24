# Backend

API REST creada con Node.js, Express y MySQL. La aplicacion expone endpoints para categorias, articulos, favoritos, mensajes, reportes y valoraciones.

## Tecnologias

- Node.js
- Express
- MySQL con `mysql2`
- `dotenv` para variables de entorno
- `cors` para permitir peticiones desde el frontend
- `nodemon` en desarrollo

## Estructura

```txt
Back/
  index.js              # Punto de entrada: carga .env y arranca el servidor
  package.json          # Dependencias y scripts
  peticiones.rest       # Peticiones de prueba para VS Code REST Client
  .env                  # Variables locales, no se sube a Git
  src/
    app.js              # Configura Express, middlewares y rutas /api
    config/
      db.js             # Pool de conexion a MySQL
    routes/             # Define endpoints por recurso
    controllers/        # Recibe req/res y llama a los modelos
    models/             # Consultas SQL y acceso a base de datos
```

## Flujo de la aplicacion

1. `Back/index.js` carga las variables de entorno desde `Back/.env`.
2. `index.js` importa `src/app.js`.
3. `src/app.js` inicializa Express, `cors`, `express.json()` y las rutas.
4. Cada archivo de `src/routes/` conecta un endpoint con su controller.
5. Cada controller valida datos basicos y llama a su model.
6. Cada model ejecuta consultas SQL usando el pool de `src/config/db.js`.

## Scripts

Instalar dependencias:

```bash
npm install
```

Arrancar en desarrollo:

```bash
npm run dev
```

El script `dev` ejecuta:

```bash
nodemon index.js
```

## Variables de entorno

Crear un archivo `.env` dentro de `Back/` con esta estructura:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_PORT=3306
DB_NAME=nombre_bbdd
```

## Endpoints principales

Base URL:

```txt
http://localhost:3000/api
```

### Test

- `GET /api/test`

### Categorias

- `GET /api/categories`

### Articulos

- `GET /api/articles`
- `GET /api/articles/:id`
- `POST /api/articles`
- `PUT /api/articles/:id/buy`
- `PUT /api/articles/:id/reserve`

Filtros disponibles en `GET /api/articles`:

- `title`
- `categoryId`
- `status`
- `minPrice`
- `maxPrice`

Ejemplo:

```txt
GET /api/articles?title=lego&categoryId=1&minPrice=10&maxPrice=100
```

### Favoritos

- `POST /api/favorites`

### Mensajes

- `POST /api/messages`

### Reportes

- `POST /api/reports`

### Valoraciones

- `POST /api/reviews`

## Archivo de peticiones

El archivo `peticiones.rest` contiene ejemplos para probar la API desde la extension REST Client de VS Code.

Antes de lanzar las peticiones, asegurate de tener el servidor arrancado:

```bash
npm run dev
```

## Notas

- `.env` y `node_modules/` estan ignorados por Git.
- Las consultas SQL usan parametros `?`, lo que ayuda a evitar inyeccion SQL.
- Actualmente no hay autenticacion; los ids de usuario se reciben desde el body de las peticiones.
- El script `test` todavia no ejecuta pruebas reales.




## añadí una columna en articulos 
ALTER TABLE articulos ADD COLUMN in_promotion BOOLEAN NOT NULL DEFAUL FALSE

UPDATE articulos
SET in_promotion = 0
WHERE id IN (2, 9, 11, 20, 33);

## añadí tabla conversation
CREATE TABLE conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_id INT NOT NULL,
  buyer_id INT NOT NULL,
  seller_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_message_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE mensajes
ADD COLUMN conversation_id INT NULL;

ALTER TABLE mensajes
ADD CONSTRAINT fk_mensajes_conversations
FOREIGN KEY (conversation_id)
REFERENCES conversations(id);


Con esa tabla de mensajes puedes guardar mensajes, pero para recuperar el historial del hilo falta una entidad que agrupe la conversación.

Cada conversación representa un hilo entre comprador y vendedor sobre un artículo.

profiles
    │
    ├── conversations
    │       │
    │       └── messages
    │
articles

1 conversación muchos mensajes 


## añadir columna para saber tipo mensaje 
ALTER TABLE mensajes
ADD COLUMN tipo_mensaje ENUM(
  'TEXT',
  'PRICE_OFFER',
  'DELIVERY_METHOD',
  'SYSTEM'
) NOT NULL DEFAULT 'TEXT';

const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = require('./src/app');

// INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
    console.log(path.join(__dirname, '.env'))
});

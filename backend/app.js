import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { Connection } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import testRoutes from './routes/test.routes.js';
import usersRoutes from './routes/users.routes.js';

dotenv.config();
const app = express();

// Resolver __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static('public'));
app.use(cors());
// Aumentar límite de tamaño para aceptar imágenes base64 grandes
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Página principal y login (sirven el mismo HTML)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Página para visualizar registros
// Proteger la página de registros: requiere cookie JWT válida
app.get('/registros', (req, res) => {
  const token = req.cookies?.jwt;
  if (!token) {
    return res.redirect('/login');
  }
  try {
    // Validación ligera de cookie
    jwt.verify(token, process.env.JWT_SECRET);
    return res.sendFile(path.join(__dirname, 'registros.html'));
  } catch {
    return res.redirect('/login');
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/registros', uploadRoutes);
app.use('/api', testRoutes);
app.use('/api', usersRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('💥 ERROR:', err.message);
  console.error(err.stack);
  res.status(500).json({ error: err.message, stack: err.stack });
});

Connection().then(() => {
  console.log('Conexión a la base de datos establecida');
}).catch(err => {
  console.error('Error al conectar a la base de datos:', err);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));

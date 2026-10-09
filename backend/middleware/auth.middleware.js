import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req, res, next) => {
  // 1) Intenta cookie 'jwt'
  let token = req.cookies?.jwt;

  // 2) Si no hay cookie, intenta Authorization header
  if (!token) {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      token = authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader;
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No autenticado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

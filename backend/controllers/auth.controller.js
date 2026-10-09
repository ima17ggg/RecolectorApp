import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req, res) => {
  const { Nombre, Correo, Pass } = req.body;

  if (!Nombre || !Correo || !Pass) {
    return res.status(400).json({ error: 'Nombre, Correo y Pass son requeridos' });
  }

  const hashed = await bcrypt.hash(Pass, 10);

  await pool.query(
    'INSERT INTO Usuarios (Nombre, Correo, Pass) VALUES (?, ?, ?)',
    [Nombre, Correo, hashed]
  );

  res.json({ message: 'Usuario registrado con éxito' });
};

export const login = async (req, res) => {
  const { Correo, Contraseña } = req.body;

  if (!Correo || !Contraseña) {
    return res.status(400).json({ error: 'Correo y Contraseña son requeridos' });
  }

  const [rows] = await pool.query(
    'SELECT * FROM Usuarios WHERE Correo = ?',
    [Correo]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  const user = rows[0];
  const validPass = await bcrypt.compare(Contraseña, user.Pass);

  if (!validPass) {
    return res.status(401).json({ message: 'Contraseña incorrecta' });
  }

  const token = jwt.sign(
    { id: user.Id, correo: user.Correo },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.cookie('jwt', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 60 * 60 * 1000
  });

  res.json({ message: 'Login exitoso', token });
};

export const profile = async (req, res) => {
  const userId = req.user.id;

  const [rows] = await pool.query(
    'SELECT Id, Nombre, Correo FROM Usuarios WHERE Id = ?',
    [userId]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  res.json(rows[0]);
};

export const logout = async (req, res) => {
  res.clearCookie('jwt');
  res.json({ message: 'Logout exitoso' });
};

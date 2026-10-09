import { pool, Connection } from '../config/db.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

async function saveDataUrlToFile(dataUrl, prefix) {
  if (!dataUrl || typeof dataUrl !== 'string') return null;
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;
  const mime = match[1];
  const b64 = match[2];
  const ext = mime.includes('jpeg') || mime.includes('jpg') ? 'jpg' : (mime.includes('png') ? 'png' : 'bin');
  const filename = `${Date.now()}_${prefix}.${ext}`;
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, filename), Buffer.from(b64, 'base64'));
  return filename;
}

export const crearRegistro = async (req, res) => {
  try {
    // Solo recibimos imágenes/firma. Ignoramos cualquier campo de usuario.
    const { Foto1, Foto2, Firma } = req.body;

    // Guardar imágenes a disco si vienen en base64 (data URL) y almacenar solo el nombre de archivo
    const foto1Nombre = Foto1 && Foto1.startsWith('data:') ? await saveDataUrlToFile(Foto1, 'foto1') : Foto1;
    const foto2Nombre = Foto2 && Foto2.startsWith('data:') ? await saveDataUrlToFile(Foto2, 'foto2') : Foto2;
    const firmaNombre = Firma && Firma.startsWith('data:') ? await saveDataUrlToFile(Firma, 'firma') : Firma;

    await pool.query(
      `INSERT INTO Registros (Foto1, Foto2, Firma, FechaRegistro) VALUES (?, ?, ?, NOW())`,
      [foto1Nombre, foto2Nombre, firmaNombre]
    );

    res.json({ message: 'Registro guardado con éxito' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerRegistros = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT Id, FechaRegistro, Foto1, Foto2, Firma FROM Registros ORDER BY FechaRegistro DESC`
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

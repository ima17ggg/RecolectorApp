import express from 'express';
import { crearRegistro, obtenerRegistros } from '../controllers/upload.controller.js';

const router = express.Router();

// Crear un nuevo registro (público)
router.post('/', crearRegistro);

// Obtener todos los registros (público)
router.get('/', obtenerRegistros);

export default router;

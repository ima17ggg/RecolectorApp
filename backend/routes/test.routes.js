import { Router } from 'express';
import { Connection } from '../config/db.js';

const router = Router();

router.get("/test", async (req, res) => {
    try {
        await Connection();
        const result = await pool.request().query('SELECT GETDATE() AS now');
        res.json({ message: 'conexion exitosa', now: result.recordset[0].now });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
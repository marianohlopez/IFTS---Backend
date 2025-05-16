import { Router } from 'express';
import { listProducts, addProduct } from '../controllers/ProductController.js';

const router = Router();

// Genero las rutas para los productos utilizando funciones
// predefinidas en el archivo ProductController.js

router.get('/', listProducts);
router.post('/add', addProduct);

export const productRouter = router;



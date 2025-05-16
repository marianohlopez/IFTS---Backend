import { Router } from 'express';
import { listProducts, addProduct, updateProduct, deleteProduct } from '../controllers/ProductController.js';

const router = Router();

// Genero las rutas para los productos utilizando funciones
// predefinidas en el archivo ProductController.js

// Listar los productos
router.get('/', listProducts);

// Agregar un producto
router.post('/add', addProduct);

// Actualizar un producto 
router.put('/:id', updateProduct);

// Eliminar un producto 
router.delete('/:id', deleteProduct);

export const productRouter = router;



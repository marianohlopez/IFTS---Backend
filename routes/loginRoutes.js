import Router from 'express';
import { loginUser } from '../controllers/UserController.js';

const router = Router();

// Genero las rutas para el login utilizando pug y funciones
// predefinidas en el archivo UserController.js

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', loginUser);

export const loginRouter = router;
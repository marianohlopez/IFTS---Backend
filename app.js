import express, { json, urlencoded } from "express";
import { loginRouter } from "./routes/loginRoutes.js";
import { productRouter } from "./routes/productRoutes.js";
import { petRouter } from "./routes/petRoutes.js";
import { isLoggedIn } from "./middlewares/auth.js";
import { appointmentRouter } from "./routes/appointmentRoutes.js";
import { lostPetRouter } from "./routes/lostPetRoutes.js";

const app = express();

app.use(json());

app.use(urlencoded({ extended: true }));

// Configuracion del motor de vistas
app.set('view engine', 'pug');

// Redireccionamiento a las url con sus correspondientes rutas
app.use('/', loginRouter);
app.use('/products', isLoggedIn, productRouter);
app.use('/pets', isLoggedIn, petRouter);
app.use('/appointments', isLoggedIn, appointmentRouter);
app.use('/lostpets', isLoggedIn, lostPetRouter);


app.listen(3000, () => console.log('Server running on http://localhost:3000'));
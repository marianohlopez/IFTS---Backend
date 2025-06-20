import express, { json, urlencoded } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/Users.js";
import { loginRouter } from "./routes/loginRoutes.js";
import { productRouter } from "./routes/productRoutes.js";
import { petRouter } from "./routes/petRoutes.js";
import { isLoggedIn } from "./middlewares/auth.js";
import { appointmentRouter } from "./routes/appointmentRoutes.js";
import { lostPetRouter } from "./routes/lostPetRoutes.js";

dotenv.config(); //Inicializacion de variables de entorno

const app = express();

app.use(json());

app.use(urlencoded({ extended: true }));

// Conexión a base de datos Mongo Atlas
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Estrategia local de Passport
passport.use(new LocalStrategy(async (username, password, done) => {
  const user = await User.findOne({ username });
  if (!user) return done(null, false, { message: 'Usuario no encontrado' });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return done(null, false, { message: 'Contraseña incorrecta' });

  return done(null, user);
}));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Configuracion del motor de vistas
app.set('view engine', 'pug');

// Redireccionamiento a las url con sus correspondientes rutas
app.use('/', loginRouter);
app.use('/products', isLoggedIn, productRouter);
app.use('/pets', isLoggedIn, petRouter);
app.use('/appointments', isLoggedIn, appointmentRouter);
app.use('/lostpets', isLoggedIn, lostPetRouter);


app.listen(3000, () => console.log('Server running on http://localhost:3000'));

export default app;


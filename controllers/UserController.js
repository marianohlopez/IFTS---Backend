import User from "../models/Users.js";
import passport from "passport";

// Controlador para realizar login de usuario y modificar el json correspondiente

export const loginUser = async (req, res, next) => {
  try {
    passport.authenticate('local', {
      successRedirect: '/products',
      failureRedirect: '/',
    })(req, res, next);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error durante el login');
  }
};

// Controlador para salir de la sesion de usuario

export const logOut = async (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error durante el logout');
      }
      res.redirect('/');
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cerrar sesión');
  }
};

// Controlador para registrar usuarios

export const registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.send('Ese usuario ya existe');
    }

    const user = new User({ username, password, role });

    await user.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error durante el registro');
  }
};




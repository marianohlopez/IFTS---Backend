import User from '../classes/User.js';

// Funcion para realizar login de usuario y modificar el json correspondiente

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const userModel = new User();
    const user = await userModel.get();
    if (user && user.username === username && user.password === password) {
      user.loggedIn = true;
      await userModel.save(user);
      res.redirect('/products');
    } else {
      res.send('Login Failed');
    }
  } catch (err) {
    res.status(500).send('Error during login');
  }
};
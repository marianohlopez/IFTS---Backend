import User from '../classes/User.js';

// Funcion para realizar login de usuario y modificar el json correspondiente

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.get();
    if (user && user.username === username && user.password === password) {
      user.loggedIn = true;
      await User.save(user);
      res.redirect('/products');
    } else {
      res.send('Login Failed');
    }
  } catch (err) {
    res.status(500).send('Error during login');
  }
};

export const logOut = async (req, res) => {
  try {
    const user = await User.get();
    if (user && user.loggedIn)
      user.loggedIn = false;
    await User.save(user);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error during logging out');
  }
};
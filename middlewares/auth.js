import User from "../classes/User.js"

export const isLoggedIn = async (req, res, next) => {
  try {
    const user = await User.get();
    if (user && user.loggedIn === true) {
      return next();
    } else {
      res.redirect('/');
    }
  } catch (err) {
    res.status(500).send(`Error during autentication: ${err}`);
  }
}
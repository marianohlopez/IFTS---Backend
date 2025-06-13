export const isLoggedIn = async (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}
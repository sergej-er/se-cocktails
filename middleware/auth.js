module.exports = {
  requireAuth: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/");
    }
  },
  redirectWhenLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      res.redirect("/cocktails");
    } else {
      return next();
    }
  },
};

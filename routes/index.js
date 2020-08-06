const express = require("express");
const router = express.Router();
const { redirectWhenLoggedIn } = require("../middleware/auth");

const Cocktail = require("../models/Cocktail");

// @desc Login/Landing
// @route GET /
router.get("/", redirectWhenLoggedIn, (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

module.exports = router;

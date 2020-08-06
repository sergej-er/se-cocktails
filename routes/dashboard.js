const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");

const Cocktail = require("../models/Cocktail");

// @desc Dashboard
// @route GET /dashboard
router.get("/", requireAuth, async (req, res) => {
  try {
    const cocktails = await Cocktail.find({ user: req.user.id })
      .sort({ createdAt: "desc" })
      .lean();
    res.render("cocktails/", {
      listTitle: "Meine Cocktails",
      displayName: req.user.displayName,
      image: req.user.image,
      dashboard: true,
      cocktails,
    });
  } catch (error) {
    res.render("error/500");
  }
});

module.exports = router;

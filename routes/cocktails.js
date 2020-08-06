const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { requireAuth } = require("../middleware/auth");

const Cocktail = require("../models/Cocktail");
const User = require("../models/User");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

let upload = multer({ storage: storage });

// @desc Show public cocktail page
// @route GET /cocktails
router.get("/", requireAuth, async (req, res) => {
  let cocktails = await Cocktail.find({ status: "public" })
    .populate("user")
    .sort({ createdAt: "desc" })
    .lean();
  res.render("cocktails/", {
    listTitle: "Alle Cocktails",
    displayName: req.user.displayName,
    image: req.user.image,
    cocktails,
  });
});

// @desc Show page of specific cocktail
// @route GET /cocktails/:id
router.get("/cocktail/:id", requireAuth, async (req, res) => {
  let cocktailId = req.params.id;
  const cocktail = await Cocktail.findOne({ _id: cocktailId })
    .populate("user")
    .lean();

  if (!cocktail) {
    return res.render("error/404");
  }

  res.render("cocktails/cocktail", {
    cocktail,
  });
});

// @desc Show edit page
// @route GET /cocktails/edit/:id
router.get("/edit/:id", requireAuth, async (req, res) => {
  const cocktailId = req.params.id;
  const cocktail = await Cocktail.findOne({
    _id: cocktailId,
  }).lean();

  if (!cocktail) {
    return res.render("error/404");
  }

  if (cocktail.user != req.user.id) {
    res.redirect("/cocktails");
  } else {
    res.render("cocktails/edit", cocktail);
  }
});

// @desc Show add page
// @route GET /cocktails/add
router.get("/add", requireAuth, (req, res) => {
  res.render("cocktails/add");
});

// @desc Show cocktails from user
// @route GET /cocktails/user/:id
router.get("/user/:id", requireAuth, async (req, res) => {
  const userId = req.params.id;
  const user = await User.findOne({ _id: userId });
  const cocktails = await Cocktail.find({ user: userId })
    .populate("user")
    .sort({ createdAt: "desc" })
    .lean();
  res.render("cocktails/", {
    listTitle: "Cocktails von " + user.displayName,
    displayName: req.user.displayName,
    image: req.user.image,
    cocktails,
  });
});

// @desc Process add form
// @route POST /cocktails
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  let image = await {
    data: fs.readFileSync(
      path.join(__dirname + "/../uploads/" + req.file.filename)
    ),
    contentType: "image/png",
  };

  try {
    req.body.user = req.user.id;
    req.body.image = image;
    req.body.ingredients = req.body.ingredients.filter(
      (i) => i != "" || i.length != 0
    );
    await Cocktail.create(req.body);
    res.redirect("/dashboard");
    fs.unlinkSync(path.join(__dirname + "/../uploads/" + req.file.filename));
  } catch (error) {
    console.log(error);
    res.render("error/500");
  }
});

// @desc Update cocktail
// @route PUT /cocktails/:id
router.put("/:id", upload.single("image"), requireAuth, async (req, res) => {
  let cocktail = await Cocktail.findById(req.params.id).lean();
  let imageChanged = false;
  req.body.image = cocktail.image;

  if (req.file) {
    let image = await {
      data: fs.readFileSync(
        path.join(__dirname + "/../uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    };
    req.body.image = image;
    imageChanged = true;
  }

  if (!cocktail) {
    return res.render("error/404");
  }

  if (cocktail.user != req.user.id) {
    res.redirect("/cocktails");
  } else {
    cocktail = await Cocktail.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (imageChanged) {
      await fs.unlinkSync(
        path.join(__dirname + "/../uploads/" + req.file.filename)
      );
    }
    res.redirect("/dashboard");
  }
});

// @desc Delete cocktail
// @route DELETE /cocktails/:id
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const cocktailId = req.params.id;
    let cocktail = await Cocktail.findById(cocktailId).lean();

    if (!cocktail) {
      res.render("error/404");
    }

    if (cocktail.user != req.user.id) {
      res.redirect("/cocktails");
    } else {
      await Cocktail.remove({ _id: cocktailId });
      res.redirect("/dashboard");
    }
  } catch (error) {
    console.log(error);
    return res.render("error/500");
  }
});

module.exports = router;

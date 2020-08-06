require("dotenv").config();
const path = require("path");
const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require("express-session");
const morgan = require("morgan");
const hbs = require("express-handlebars");
const passport = require("passport");
const MongoStore = require("connect-mongo")(session);
const connectDB = require("./config/db");

// Passport config
require("./config/passport")(passport);

// Connect to database
connectDB();

// Express
const app = express();

// Body parser
app.use(express.urlencoded({ extended: true }));

// Method override
app.use(methodOverride("_method"));

// Morgan
app.use(morgan("dev"));

// Handlebars
app.engine(
  ".hbs",
  hbs({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: require("./helpers/hbs"),
  })
);

app.set("view engine", ".hbs");

// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/cocktails", require("./routes/cocktails"));
app.use("/dashboard", require("./routes/dashboard"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log("Listening on http://localhost:" + PORT));

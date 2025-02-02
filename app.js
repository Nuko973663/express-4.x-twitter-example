require("dotenv").config();

var express = require("express");
var passport = require("passport");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth");
var myaccountRouter = require("./routes/myaccount");

var app = express();

require("./boot/db")();
require("./boot/auth")();

// Configure view engine to render EJS templates.
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  require("express-session")({
    secret: "}%i=7pw*pTE-j)w@kJT=N>!,EEPgW",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/myaccount", myaccountRouter);

module.exports = app;

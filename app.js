require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
// const md5 = require("md5");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//database creation
mongoose.connect("mongodb://0.0.0.0:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// userSchema.plugin(encrypt, {
//   secret: process.env.SECRET,
//   encryptedFields: ["password"],
// });

const User = new mongoose.model("User", userSchema);

//get methods
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

//post methods

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const user = new User({
      email: req.body.username,
      password: hash,
    });
    user.save((err) => {
      if (err) console.log(err);
      else {
        res.render("secrets");
      }
    });
  });
});

app.post("/login", (req, res) => {
  const pass = req.body.password;
  User.findOne({ email: req.body.username }, (err, foundUser) => {
    if (err) console.log(err);
    else {
      if (foundUser) {
        bcrypt.compare(pass, foundUser.password, function (err, result) {
          if (result == true) {
            res.render("secrets");
          }
        });
      }
    }
  });
});

app.listen(3000, (req, res) => console.log("listning to port 3000"));

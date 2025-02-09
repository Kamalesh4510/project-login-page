var express = require("express"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  bodyParser = require("body-parser"),
  LocalStrategy = require("passport-local"),
  User = require("./models/user-sign"),
  Login = require("./models/user-login");

mongoose.connect("mongodb://127.0.0.1:27017/mvc");

var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  require("express-session")({
    secret: "evindeejay",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy(Login.authenticate()));
passport.serializeUser(Login.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
    res.render("home")
})

app.get("/signup", function (req, res) {
  res.render("signup");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/signup", function (req, res) {
  var firstname = req.body.firstName;
  var lastname = req.body.lastName;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  User.register(
    new User({ firstName: firstname }),
    new User({ lastName: lastname }),
    new User({ email: email }),
    new User({ username: username }),
    password,
    function (err, user) {
      if (err) {
        console.log(err);
        return res.render("signup");
      }

      passport.authenticate("local")(req, res, function () {
        res.render("login");
      });
    }
  );
});


app.get("/login", function (req, res) {
  res.render("login");
});


app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});

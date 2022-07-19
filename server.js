const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const UserModel = require("./src/models/user.model");
const connectToDatabase = require("./src/database/connect");

const session = require("express-session");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "./src/models/views");

app.get("/views/users", async (req, res) => {
  const users = await UserModel.find({});

  res.render("index", { users });
});

app.get("/", async (req, res, next) => {
  res.sendFile(__dirname + "/formtest.html");
});

app.post("/", async (req, res, next) => {
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error("Passwords do not match.");
    err.status = 400;
    res.send("As senhas não são iguais");
    return next(err);
  }
  if (
    req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf
  ) {
    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    };

    UserModel.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect("/profile");
      }
    });
  } else {
    var err = new Error("Todos os dados são obrigatórios");
    err.status = 400;
    return next(err);
  }
});

// GET route after registering
app.get("/profile", function (req, res, next) {
  UserModel.findById(req.session.userId).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      if (user === null) {
        var err = new Error("Not authorized! Go back!");
        err.status = 400;
        return next(err);
      } else {
        return res.send(
          "<h1>Name: </h1>" +
            user.username +
            "<h2>Mail: </h2>" +
            user.email +
            '<br><a type="button" href="/logout">Logout</a>'
        );
      }
    }
  });
});

// GET for logout logout
app.get("/logout", function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/");
      }
    });
  }
});

const port = 8080;
app.listen(port, () => console.log(`Rodando na Porta ${port}!`));

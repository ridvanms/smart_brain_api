const express = require("express");
const bcrypt = require("bcrypt");
const knex = require("knex");
const cors = require("cors");

const register = require("./controls/register");
const signin = require("./controls/signin");
const profile = require("./controls/profile");
const image = require("./controls/image");

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  console.log("New one");
  next();
});

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "123",
    database: "smart_brain",
  },
  searchPath: ["knex", "public"],
});

// db.select("*").from("users").then(console.log);

app.get("/", (req, res) => {
  res.status(200).json("it's working fine");
});

app.post("/register", (req, res) => {
  register.registerHandler(req, res, db, bcrypt);
});
app.post("/signin", (req, res) => {
  signin.signingHandler(req, res, db, bcrypt);
});
app.get("/profile/:id", (req, res) => {
  profile.profileHandler(req, res, db);
});
app.put("/image", (req, res) => {
  image.imageHandler(req, res, db);
});

app.listen(process.env.PORT || 3000);

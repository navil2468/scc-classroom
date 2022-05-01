require("dotenv").config();
const express = require("express");
const path = require("path");
const pool = require("./sql/db");
const session = require("express-session");
const passport = require("passport");
require("./passportFunctions");
const authRouter = require("./routes/auth");
const classesRouter = require("./routes/classes");

const app = express();

app.set("view engine", "ejs");
app.use("/static", express.static(path.join(__dirname, "static")));
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      pool: pool,
    }),
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", async (req, res) => {
  res.render("pages/index", {});
});

app.use("/auth", authRouter);
app.use("/classes", classesRouter);

const port = process.env.PORT ?? 3000;
app.listen(port, () =>
  console.log(`View the application at http://localhost:${port}`)
);

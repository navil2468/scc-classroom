const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.use("/static", express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
  res.render("pages/index", {});
});

const port = process.env.PORT ?? 3000;
app.listen(port, () =>
  console.log(`View the application at http://localhost:${port}`)
);

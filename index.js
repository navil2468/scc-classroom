require("dotenv").config();
const express = require("express");
const path = require("path");
const pool = require("./sql/db.js");

const app = express();

app.set("view engine", "ejs");
app.use("/static", express.static(path.join(__dirname, "static")));

app.get("/", async (req, res) => {
  //just testing stuff
  const { rows } = await pool.query(` 
    SELECT * FROM teacher
  `);
  console.log(rows);
  res.render("pages/index", { rows });
});

const port = process.env.PORT ?? 3000;
app.listen(port, () =>
  console.log(`View the application at http://localhost:${port}`)
);

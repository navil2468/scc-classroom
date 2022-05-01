const express = require("express");

const router = express.Router();

function checkAuth(req, res, next) {
  if (!req.user) {
    res.redirect("/auth/login");
  } else {
    next();
  }
}

router.get("/", checkAuth, (req, res) => {
  console.log("req.user: ", req.user);
  res.send(JSON.stringify(req.user, null, 2));
});

module.exports = router;

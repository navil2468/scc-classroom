const express = require("express");
const passport = require("passport");

const router = express.Router();
const scopes = ["profile", "email"];

router.get(
  "/login",
  passport.authenticate("google", {
    scope: scopes,
    accessType: "offline",
    prompt: "consent",
    successRedirect: "/googlecallback",
    failureRedirect: "/",
  })
);

router.get(
  "/googlecallback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.save(() => {
      res.redirect("/classes");
    });
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;

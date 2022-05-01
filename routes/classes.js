const express = require("express");
const pool = require("../sql/db");

const router = express.Router();

function checkAuth(req, res, next) {
  if (!req.user) {
    res.redirect("/auth/login");
  } else {
    next();
  }
}

router.get("/", checkAuth, async (req, res) => {
  if (req.user.accountType === "teacher") {
    const { rows } = await pool.query(
      "SELECT * FROM class WHERE teacher_id = $1",
      [req.user.id]
    );
    res.render("pages/classes", { classes: rows, user: req.user });
  } else if (req.user.accountType === "student") {
    const { rows } = await pool.query(
      `
		SELECT class.* FROM student_enrollments 
		JOIN student ON student.id = student_enrollments.student_id 
		JOIN class ON class.id = student_enrollments.class_id	
		WHERE student.id = $1
		`,
      [req.user.id]
    );
    res.render("pages/classes", { classes: rows, user: req.user });
  }
});

module.exports = router;

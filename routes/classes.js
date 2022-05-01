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
      "SELECT class.*, slide_numbers.total_slides FROM class JOIN slide_numbers ON slide_numbers.subject = class.subject WHERE teacher_id = $1",
      [req.user.id]
    );
    res.render("pages/classes", { classes: rows, user: req.user });
  } else if (req.user.accountType === "student") {
    const { rows } = await pool.query(
      `
		SELECT class.*, slide_numbers.total_slides FROM student_enrollments 
		JOIN student ON student.id = student_enrollments.student_id 
		JOIN class ON class.id = student_enrollments.class_id	
		JOIN slide_numbers ON slide_numbers.subject = class.subject
		WHERE student.id = $1
		`,
      [req.user.id]
    );
    res.render("pages/classes", { classes: rows, user: req.user });
  }
});

router.get("/:classId", checkAuth, async (req, res) => {
  const { classId } = req.params;
  const { rows } = await pool.query(
    "SELECT class.*, slide_numbers.total_slides FROM class JOIN slide_numbers ON slide_numbers.subject = class.subject WHERE id = $1",
    [classId]
  );
  console.log("class with id ", classId, rows);
  if ("id" in rows[0]) {
    res.render("pages/class", { course: rows[0], user: req.user });
  } else {
    res.render("pages/class", {
      class: null,
      error: `No class found with id "${classId}"`,
      user: req.user,
    });
  }
});

module.exports = router;

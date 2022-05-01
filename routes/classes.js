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
  } else if (req.user.accountType === "admin") {
    const { rows } = await pool.query(
      "SELECT class.*, teacher.name, slide_numbers.total_slides FROM class JOIN slide_numbers ON slide_numbers.subject = class.subject JOIN teacher ON teacher.id = class.teacher_id"
    );
    console.log("admin rows", rows);
    res.render("pages/classes", { classes: rows, user: req.user });
  }
});

router.get("/admin", async (req, res) => {
  if (req.user.accountType === "admin") {
  } else res.redirect("/auth/login");
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

router.get("/:classId/feedback/create", checkAuth, async (req, res) => {
  console.log(req.query);
  const { classId } = req.params;
  const { message, slideNumber } = req.query;
  await pool.query(
    "INSERT INTO feedback VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5)",
    [req.user.id, classId, message, new Date(), slideNumber]
  );

  await pool.query(
    "UPDATE class SET current_slide = $1 WHERE teacher_id = $2 AND id = $3",
    [slideNumber, req.user.id, classId]
  );

  res.redirect(`/classes/${classId}/feedback`);
});

router.get("/:classId/feedback", checkAuth, async (req, res) => {
  const { classId } = req.params;
  const { rows } = await pool.query(
    "SELECT feedback.* FROM feedback WHERE class_id = $1",
    [classId]
  );

  res.render("pages/feedback", { user: req.user, feedback: rows });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const { getSubjects, createAdmin } = require("../controllers/adminController");

// Define routes
router.get("/sub", getSubjects); // Fetch student subjects

// API to check login details
router.post("/login", async (req, res) => {
  const { hallticketno, password } = req.body;

  try {
    // Check if hallticketno exists
    const result = await pool.query(
      "SELECT * FROM students WHERE hallticketno = $1",
      [hallticketno]
    );

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ error: "Invalid hallticketno or password" });
    }

    const student = result.rows[0];

    // Compare hashed passwords
    const isValidPassword = await bcrypt.compare(
      password,
      student.passwordhash
    );

    if (!isValidPassword) {
      return res
        .status(401)
        .json({ error: "Invalid hallticketno or password" });
    }

    // Successful login
    res
      .status(200)
      .json({ message: "Login successful", studentId: student.hallticketno });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/student-attendance", async (req, res) => {
  const { hallticketno } = req.query; // Student Hall Ticket Number from query string
  if (!hallticketno) {
    return res.status(400).json({ error: "Hall Ticket Number is required" });
  }

  try {
    // Fetch the student's present semester and registered subjects for that semester
    const studentQuery = `
            SELECT presentsemester, 
                   CASE presentsemester
                       WHEN 1 THEN sem1subjectsregistered
                       WHEN 2 THEN sem2subjectsregistered
                       WHEN 3 THEN sem3subjectsregistered
                       WHEN 4 THEN sem4subjectsregistered
                       WHEN 5 THEN sem5subjectsregistered
                       WHEN 6 THEN sem6subjectsregistered
                       WHEN 7 THEN sem7subjectsregistered
                       WHEN 8 THEN sem8subjectsregistered
                   END AS registered_subjects
            FROM students
            WHERE hallticketno = $1;
        `;

    const studentResult = await pool.query(studentQuery, [hallticketno]);

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    const { presentsemester, registered_subjects } = studentResult.rows[0];

    if (!registered_subjects) {
      return res
        .status(404)
        .json({ error: "No subjects registered for the current semester" });
    }

    // Parse the registered subjects into an array
    const subjectCodes = registered_subjects.split(",");

    // Fetch attendance details for the registered subjects
    const attendanceQuery = `
            SELECT 
                s.name AS subject_name,
                s.code AS subject_code,
                COUNT(a.attendanceid) AS total_classes,
                SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS classes_attended
            FROM 
                subjects s
            JOIN 
                attendance a ON s.id = a.subjectid
            WHERE 
                a.studenthallticketno = $1
                AND s.code = ANY($2::text[])
            GROUP BY 
                s.id, s.name, s.code
            ORDER BY 
                s.name;
        `;

    const attendanceResult = await pool.query(attendanceQuery, [
      hallticketno,
      subjectCodes,
    ]);

    // Return the attendance details
    res
      .status(200)
      .json({ attendance: attendanceResult.rows, semester: presentsemester });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

const pool = require('../config/db');

const getAttendance = async (req, res) => {
  const { subjectId } = req.params;

  try {
    const result = await pool.query(
      `SELECT attendancedate AS date, status, 
       FROM attendance
       WHERE subjectid = $1`,
      [subjectId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const addAttendance = async (req, res) => {
  const { subjectId } = req.params;
  const { date, studentId, status } = req.body;

  try {
    await pool.query(
      `INSERT INTO attendance (attendancedate, subjectid, studenthallticketno, status)
       VALUES ($1, $2, $3, $4)`,
      [date, subjectId, studentId, status]
    );

    res.status(201).json({ message: 'Attendance added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAttendance, addAttendance };

const express = require('express');
const { getAttendance, addAttendance } = require('../controllers/attendanceController');

const router = express.Router();

router.get('/:subjectId', getAttendance);
router.post('/:subjectId', addAttendance);

module.exports = router;

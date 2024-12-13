//const pool = require('../config/db');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,    
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});
// Fetch all admins
const fetchsubjects = async (hallticketno) => {
  const { rows } = await pool.query(`SELECT 
    CASE 
        WHEN s.PresentSemester = 1 THEN s.SEM1SubjectsRegistered
        WHEN s.PresentSemester = 2 THEN s.SEM2SubjectsRegistered
        WHEN s.PresentSemester = 3 THEN s.SEM3SubjectsRegistered
        WHEN s.PresentSemester = 4 THEN s.SEM4SubjectsRegistered
        WHEN s.PresentSemester = 5 THEN s.SEM5SubjectsRegistered
        WHEN s.PresentSemester = 6 THEN s.SEM6SubjectsRegistered
        WHEN s.PresentSemester = 7 THEN s.SEM7SubjectsRegistered
        WHEN s.PresentSemester = 8 THEN s.SEM8SubjectsRegistered
    END AS RegisteredSubjects
FROM 
    Students s
WHERE 
    s.HallTicketNo = $1; `, [hallticketno]);
  return rows[0];
};

// Insert a new admin
const insertAdmin = async (name, email) => {
  const { rows } = await pool.query(
    'INSERT INTO admins (name, email) VALUES ($1, $2) RETURNING id',
    [name, email]
  );
  return rows[0];
};

module.exports = { fetchsubjects, insertAdmin };
